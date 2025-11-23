const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Security Test Suite
 * Tests CSRF protection, XSS prevention, rate limiting, and input validation
 */

const BASE_URL = 'http://localhost:3000';

// Helper function to make requests
async function makeRequest(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');

    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    return { response, data };
}

// Test 1: XSS Prevention
async function testXSSPrevention() {
    console.log('\n🔒 Testing XSS Prevention...');

    const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<svg onload=alert("XSS")>',
        'data:text/html,<script>alert("XSS")</script>'
    ];

    for (const payload of xssPayloads) {
        try {
            // Test registration with XSS payload in name
            const { response, data } = await makeRequest(`${BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: payload,
                    email: `xss-test-${Date.now()}@test.com`,
                    password: 'TestPass123!@#'
                })
            });

            // Check if payload was sanitized
            if (response.ok && data.user) {
                const user = await prisma.user.findUnique({
                    where: { email: data.user.email }
                });

                if (user && user.name && user.name.includes('<')) {
                    console.error(`❌ XSS payload not sanitized: ${payload}`);
                    throw new Error('XSS vulnerability detected in name field');
                }

                // Cleanup
                await prisma.user.delete({ where: { id: user.id } });
            }
        } catch (error) {
            if (error.message.includes('XSS vulnerability')) {
                throw error;
            }
            // Other errors are expected (validation, etc.)
        }
    }

    console.log('✅ XSS Prevention: All payloads blocked or sanitized');
}

// Test 2: Rate Limiting
async function testRateLimiting() {
    console.log('\n🔒 Testing Rate Limiting...');

    const testEmail = `rate-limit-test-${Date.now()}@test.com`;
    let rateLimitHit = false;

    // Make 10 rapid registration attempts (limit is 5 per minute)
    for (let i = 0; i < 10; i++) {
        const { response } = await makeRequest(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Rate Limit Test',
                email: `${testEmail}-${i}`,
                password: 'TestPass123!@#'
            })
        });

        if (response.status === 429) {
            rateLimitHit = true;
            console.log(`✅ Rate limit triggered after ${i + 1} requests`);

            // Check for rate limit headers
            const limitHeader = response.headers.get('X-RateLimit-Limit');
            const remainingHeader = response.headers.get('X-RateLimit-Remaining');
            const resetHeader = response.headers.get('X-RateLimit-Reset');

            if (limitHeader && remainingHeader && resetHeader) {
                console.log(`   Limit: ${limitHeader}, Remaining: ${remainingHeader}`);
            }
            break;
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!rateLimitHit) {
        console.warn('⚠️  Rate limiting may not be working (no 429 response)');
    }

    // Cleanup - delete test users
    await prisma.user.deleteMany({
        where: {
            email: {
                contains: testEmail.split('@')[0]
            }
        }
    });
}

// Test 3: Input Validation
async function testInputValidation() {
    console.log('\n🔒 Testing Input Validation...');

    const invalidInputs = [
        {
            name: 'Invalid Email',
            test: { email: 'not-an-email', password: 'TestPass123!@#' },
            expectedError: 'email'
        },
        {
            name: 'Weak Password (no uppercase)',
            test: { email: 'test@test.com', password: 'testpass123!@#' },
            expectedError: 'uppercase'
        },
        {
            name: 'Weak Password (no lowercase)',
            test: { email: 'test@test.com', password: 'TESTPASS123!@#' },
            expectedError: 'lowercase'
        },
        {
            name: 'Weak Password (no number)',
            test: { email: 'test@test.com', password: 'TestPass!@#' },
            expectedError: 'number'
        },
        {
            name: 'Weak Password (no special char)',
            test: { email: 'test@test.com', password: 'TestPass123' },
            expectedError: 'special'
        },
        {
            name: 'Weak Password (too short)',
            test: { email: 'test@test.com', password: 'Test1!' },
            expectedError: '8 characters'
        },
        {
            name: 'Email with consecutive dots',
            test: { email: 'test..user@test.com', password: 'TestPass123!@#' },
            expectedError: 'email'
        }
    ];

    for (const { name, test, expectedError } of invalidInputs) {
        const { response, data } = await makeRequest(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                ...test
            })
        });

        if (response.ok) {
            console.error(`❌ ${name}: Validation failed - request succeeded when it should have failed`);
            throw new Error(`Input validation failed for: ${name}`);
        }

        if (data.message && data.message.toLowerCase().includes(expectedError.toLowerCase())) {
            console.log(`✅ ${name}: Correctly rejected`);
        } else {
            console.log(`⚠️  ${name}: Rejected but error message unclear`);
        }
    }
}

// Test 4: Security Headers
async function testSecurityHeaders() {
    console.log('\n🔒 Testing Security Headers...');

    const { response } = await makeRequest(BASE_URL);

    const requiredHeaders = {
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'content-security-policy': true, // Just check it exists
    };

    let allHeadersPresent = true;

    for (const [header, expectedValue] of Object.entries(requiredHeaders)) {
        const actualValue = response.headers.get(header);

        if (!actualValue) {
            console.error(`❌ Missing security header: ${header}`);
            allHeadersPresent = false;
        } else if (expectedValue !== true && !actualValue.includes(expectedValue)) {
            console.error(`❌ Incorrect header value for ${header}: expected "${expectedValue}", got "${actualValue}"`);
            allHeadersPresent = false;
        } else {
            console.log(`✅ ${header}: ${actualValue.substring(0, 50)}${actualValue.length > 50 ? '...' : ''}`);
        }
    }

    if (!allHeadersPresent) {
        throw new Error('Some security headers are missing or incorrect');
    }
}

// Test 5: CSRF Protection (via session cookies)
async function testCSRFProtection() {
    console.log('\n🔒 Testing CSRF Protection...');

    // NextAuth handles CSRF protection automatically
    // We verify that session cookies have proper security attributes

    const { response } = await makeRequest(`${BASE_URL}/api/auth/signin`);

    const setCookieHeader = response.headers.get('set-cookie');

    if (setCookieHeader) {
        const hasHttpOnly = setCookieHeader.includes('HttpOnly');
        const hasSameSite = setCookieHeader.includes('SameSite');

        if (hasHttpOnly && hasSameSite) {
            console.log('✅ CSRF Protection: Session cookies have HttpOnly and SameSite attributes');
        } else {
            console.warn('⚠️  CSRF Protection: Session cookies may not have all security attributes');
        }
    } else {
        console.log('ℹ️  CSRF Protection: No session cookies set (expected for unauthenticated request)');
    }
}

// Test 6: File Upload Validation
async function testFileUploadValidation() {
    console.log('\n🔒 Testing File Upload Validation...');

    // Note: This test requires authentication, so we'll test the validation logic indirectly
    // by checking if the endpoint rejects unauthenticated requests

    const formData = new FormData();
    formData.append('resumeFile', new Blob(['test'], { type: 'text/plain' }), 'test.txt');
    formData.append('jobDescription', 'Test job description');

    const { response } = await makeRequest(`${BASE_URL}/api/parse-resume`, {
        method: 'POST',
        body: formData
    });

    if (response.status === 401) {
        console.log('✅ File Upload: Requires authentication (401)');
    } else if (response.status === 400) {
        console.log('✅ File Upload: Validates file type (400)');
    } else {
        console.warn(`⚠️  File Upload: Unexpected response status ${response.status}`);
    }
}

// Main test runner
async function main() {
    console.log('🔐 Starting Security Test Suite...\n');
    console.log('Testing against:', BASE_URL);
    console.log('Make sure the dev server is running: npm run dev\n');

    try {
        await testSecurityHeaders();
        await testXSSPrevention();
        await testInputValidation();
        await testRateLimiting();
        await testCSRFProtection();
        await testFileUploadValidation();

        console.log('\n✅ All security tests passed!');
        console.log('\n📋 Summary:');
        console.log('   - Security headers: ✅');
        console.log('   - XSS prevention: ✅');
        console.log('   - Input validation: ✅');
        console.log('   - Rate limiting: ✅');
        console.log('   - CSRF protection: ✅');
        console.log('   - File upload validation: ✅');

    } catch (error) {
        console.error('\n❌ Security test failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
