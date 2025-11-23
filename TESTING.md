# Automation Testing Guide

This guide outlines the steps to implement and run automation tests for the ResumeForge application.

## 🧪 Current Test Suite

We currently have **Integration Tests** and **Security Tests** located in `tests/integration/`.

### Auth Flow Test (`auth_flow.test.js`)
This script tests the entire authentication and email verification flow:
1.  **Registration**: Creates a new user via the API.
2.  **Database Verification**: Checks if the user is created in the database (unverified).
3.  **OTP Retrieval**: Fetches the generated OTP from the database (simulating checking email).
4.  **Email Verification**: Verifies the email using the OTP via the API.
5.  **Final Verification**: Confirms the user is marked as verified in the database.
6.  **Resend OTP**: Tests the resend functionality.

### Parsing Logic Test (`parsing_logic.test.js`)
This script validates the resume parsing core and API security:
1.  **Flask Parser Service**: Sends a dummy PDF directly to the Flask service (`:5001`) to verify text extraction logic works.
2.  **API Security**: Sends an unauthenticated request to the Next.js API (`:3000/api/parse-resume`) to verify it returns `401 Unauthorized`.

### Security Test Suite (`security.test.js`)
Comprehensive security testing covering:
1.  **Security Headers**: Verifies CSP, X-Frame-Options, HSTS, and other security headers
2.  **XSS Prevention**: Tests multiple XSS payloads to ensure sanitization works
3.  **Input Validation**: Tests email validation, password requirements, and file validation
4.  **Rate Limiting**: Verifies rate limits are enforced correctly
5.  **CSRF Protection**: Checks session cookie security attributes
6.  **File Upload Validation**: Tests authentication and file type validation

## 🚀 How to Run Tests

### Prerequisites
1.  **Database**: Ensure your PostgreSQL database is running and the schema is synced.
    ```bash
    npx prisma db push
    ```
2.  **Server**: The Next.js development server must be running.
    ```bash
    npm run dev
    ```
    *Note: If you recently changed the database schema, restart the server.*

3.  **Flask Parser** (for parsing tests): The Flask service must be running.
    ```bash
    cd resumeforge-parser
    python app.py
    ```

### Running All Tests
Run the following command in a separate terminal window to execute all tests found in the `tests/` directory:

```bash
npm test
```

This will run the custom test runner (`tests/runner.js`) which executes every `.test.js` file it finds.

### Running Specific Tests

```bash
# Run only auth flow tests
node tests/integration/auth_flow.test.js

# Run only security tests
node tests/integration/security.test.js

# Run only parsing tests
node tests/integration/parsing_logic.test.js
```

## 🔒 Security Testing

### Automated Security Tests

The `security.test.js` suite covers:

- **XSS Prevention**: Tests various XSS attack vectors
- **Input Validation**: Validates email, password, and file upload rules
- **Rate Limiting**: Ensures API abuse protection works
- **Security Headers**: Verifies all security headers are present
- **CSRF Protection**: Checks cookie security attributes

### Manual Security Testing

#### 1. Test Security Headers
Use browser DevTools to verify headers:

```bash
# In browser console (Network tab)
# Check response headers for any request
```

Expected headers:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (production only)

#### 2. Test Rate Limiting
Try making multiple rapid requests to `/api/register`:

```bash
# Using curl
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@test.com","password":"TestPass123!@#"}'
  echo ""
done
```

You should see `429 Too Many Requests` after the 5th request.

#### 3. Test XSS Prevention
Try submitting forms with XSS payloads:
- `<script>alert('XSS')</script>`
- `<img src=x onerror=alert('XSS')>`
- `javascript:alert('XSS')`

All should be sanitized or rejected.

#### 4. Test SQL Injection
Prisma ORM prevents SQL injection by default, but you can verify:
- Try email: `' OR '1'='1`
- Try password: `'; DROP TABLE users; --`

Both should be safely handled.

## 📱 Mobile Responsiveness Testing

### Automated Testing (Recommended)

Use browser automation tools to test responsive design:

```javascript
// Example using Playwright (not yet implemented)
// tests/e2e/mobile.test.js
const { test, expect, devices } = require('@playwright/test');

test.describe('Mobile Responsiveness', () => {
  test('should display hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('http://localhost:3000');
    
    // Hamburger menu should be visible
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();
  });
});
```

### Manual Mobile Testing

#### Test Devices and Viewports

Test on the following device sizes:

1. **iPhone SE** (375px × 667px)
   - Smallest modern iPhone
   - Test hamburger menu functionality
   - Verify text is readable
   - Check touch target sizes (minimum 44x44px)

2. **iPhone 12/13** (390px × 844px)
   - Standard iPhone size
   - Test all interactive elements
   - Verify forms are usable

3. **iPad** (768px × 1024px)
   - Tablet breakpoint
   - Should transition to desktop layout
   - Test grid layouts

4. **Desktop** (1920px × 1080px)
   - Full desktop experience
   - Verify all features work
   - Check max-width constraints

#### Using Browser DevTools

**Chrome DevTools:**
1. Press `F12` or `Cmd+Option+I` (Mac)
2. Click the device toggle button (or `Cmd+Shift+M`)
3. Select device from dropdown or set custom dimensions
4. Test in both portrait and landscape orientations

**Firefox Responsive Design Mode:**
1. Press `Cmd+Option+M` (Mac) or `Ctrl+Shift+M` (Windows/Linux)
2. Select device or set custom dimensions
3. Test touch simulation

#### Mobile Testing Checklist

- [ ] Hamburger menu opens and closes properly
- [ ] All navigation links work
- [ ] Forms are usable (inputs not too small)
- [ ] Buttons are touch-friendly (44x44px minimum)
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling
- [ ] Images scale properly
- [ ] Modals/dialogs fit on screen
- [ ] Progress indicators are visible
- [ ] Error messages display correctly

### Real Device Testing

For best results, test on actual devices:

1. **iOS Testing**:
   - Use Safari on iPhone/iPad
   - Test with iOS Simulator (Xcode)

2. **Android Testing**:
   - Use Chrome on Android device
   - Test with Android Emulator (Android Studio)

3. **Network Conditions**:
   - Test on slow 3G connection
   - Test offline behavior (if applicable)

## 🌐 Browser Compatibility Testing

### Supported Browsers

Test on the following browsers:

- **Chrome/Edge** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Mobile Safari** (iOS 14+)
- **Chrome Mobile** (Android 10+)

### Testing Checklist

- [ ] Authentication flow works
- [ ] File upload works
- [ ] Forms submit correctly
- [ ] Responsive design works
- [ ] Animations/transitions smooth
- [ ] No console errors
- [ ] Security headers present

### Browser-Specific Issues

**Safari:**
- Test date/time inputs (may render differently)
- Verify backdrop-filter support (glassmorphism)
- Check cookie handling

**Firefox:**
- Test file upload dialogs
- Verify CSS Grid layouts
- Check WebP image support

**Mobile Browsers:**
- Test touch gestures
- Verify viewport meta tag
- Check input zoom behavior

## 🛠️ Implementing New Tests

### 1. Create a Test File
Create a new file in the `tests/integration/` directory, e.g., `feature.test.js`.

### 2. Import Dependencies
You'll likely need `node-fetch` (or native `fetch` in Node 18+) and `PrismaClient`.

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
```

### 3. Write Test Logic
Structure your test with a `main` async function. Use `try/catch` blocks to handle errors and ensure the process exits with `1` on failure.

```javascript
async function main() {
  try {
    // Your test logic here
    console.log('✅ Test Passed');
  } catch (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### 4. Add to Package.json (Optional)
You can add a script to `package.json` for easier execution:

```json
"scripts": {
  "test:feature": "node tests/integration/feature.test.js"
}
```

## 🔍 Troubleshooting

### `TypeError: Cannot read properties of undefined (reading 'create')`
This usually means the Prisma Client is stale.
**Fix**:
1.  Stop the running server (`Ctrl+C`).
2.  Run `npx prisma generate`.
3.  Restart the server (`npm run dev`).

### `Connection refused`
The test script cannot connect to the API.
**Fix**: Ensure `npm run dev` is running on `localhost:3000`.

### `User already exists`
The test script attempts to clean up data, but if it fails mid-way, data might remain.
**Fix**: The script handles cleanup, but you can manually delete the test user from the database if needed.

### Security test failures
If security tests fail:
1. Check that middleware is properly configured
2. Verify environment variables are set
3. Ensure the dev server is running
4. Check browser console for CSP violations

### Mobile test failures
If mobile tests fail:
1. Clear browser cache
2. Check viewport meta tag in HTML
3. Verify CSS media queries
4. Test on actual devices for confirmation

## 📊 Test Coverage Goals

- **Unit Tests**: 80%+ coverage (not yet implemented)
- **Integration Tests**: All critical user flows
- **Security Tests**: All OWASP Top 10 vulnerabilities
- **Mobile Tests**: All major device sizes
- **Browser Tests**: All supported browsers

## 🔄 Continuous Integration

For CI/CD pipelines, add these commands:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    npm run dev &
    sleep 5
    npm test
    kill %1
```

## Additional Resources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Playwright Documentation](https://playwright.dev/)
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [Web.dev Testing Best Practices](https://web.dev/testing/)
