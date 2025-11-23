# Security Policy

## Overview

ResumeForge takes security seriously. This document outlines the security features implemented in the application and provides guidelines for reporting security vulnerabilities.

## Security Features

### 1. Authentication & Authorization

- **NextAuth.js Integration**: Secure authentication with support for:
  - Google OAuth 2.0
  - Email/Password credentials with bcrypt hashing (12 rounds)
- **Session Management**:
  - JWT-based sessions with 30-day expiration
  - Secure, HTTP-only cookies
  - CSRF protection enabled
  - Session sliding (auto-renewal on activity)
- **Email Verification**: OTP-based email verification for new registrations

### 2. Security Headers

The application implements comprehensive security headers via Next.js middleware:

- **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
- **X-Frame-Options**: Prevents clickjacking attacks (set to `DENY`)
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **Strict-Transport-Security (HSTS)**: Enforces HTTPS in production

### 3. Input Validation & Sanitization

- **Email Validation**: Strict regex validation with additional checks
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **File Upload Validation**:
  - MIME type checking
  - File extension validation
  - File size limits (default: 10MB)
- **XSS Prevention**: Comprehensive text sanitization removing:
  - HTML tags
  - Script tags
  - Event handlers
  - JavaScript protocols
  - Data URIs

### 4. Rate Limiting

Protection against abuse and DoS attacks:

- **Registration**: 5 requests per minute per IP
- **Resume Parsing**: 10 requests per minute per user
- **OTP Resend**: 5 requests per 10 minutes per email
- **General API**: 20 requests per minute

> **Note**: Current implementation uses in-memory storage. For production with multiple instances, migrate to Redis (Upstash or Vercel KV).

### 5. Usage Limits

- **Monthly Quota**: 3 resume optimizations per user per month (free tier)
- **Database Tracking**: All optimization requests are logged

### 6. Email Security

- **Retry Logic**: Automatic retries with exponential backoff for transient failures
- **Error Handling**: Proper error logging and user feedback
- **API Key Protection**: Resend API key stored in environment variables

## Environment Variables Security

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email Service
RESEND_API_KEY=...

# AI Service
OPENAI_API_KEY=...
```

### Optional Security Variables

```env
# Rate Limiting (Development only)
RATE_LIMIT_BYPASS=false

# File Upload
MAX_FILE_SIZE_MB=10

# OTP Configuration
OTP_EXPIRY_MINUTES=15
```

### Best Practices

1. **Never commit `.env.local` or `.env` files** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets regularly**, especially after team member changes
4. **Use strong, randomly generated secrets**:
   ```bash
   openssl rand -base64 32
   ```
5. **Restrict environment variable access** to necessary team members only

## HTTPS Requirements

### Production Deployment

- **HTTPS is mandatory** for production deployments
- HSTS header is automatically enabled in production
- Secure cookies require HTTPS to function properly
- OAuth providers require HTTPS redirect URIs

### Local Development

- HTTP is acceptable for `localhost` development
- Use `https://localhost` if testing OAuth flows locally

## Database Security

### Connection Security

- Use SSL/TLS for database connections in production
- Add `?sslmode=require` to PostgreSQL connection strings
- Enable connection pooling to prevent connection exhaustion

### Data Protection

- Passwords are hashed using bcrypt (12 rounds)
- OTP tokens are stored with expiration timestamps
- Sensitive data is never logged
- Use Prisma ORM to prevent SQL injection

### Backup & Recovery

- Regular automated backups recommended
- Test recovery procedures periodically
- Store backups in encrypted form
- Implement point-in-time recovery if possible

## API Security

### Flask Parser Service

- Runs on separate port (5001)
- Validates file types before processing
- Returns only extracted text (no file storage)
- Should be deployed behind authentication in production

### OpenAI Integration

- API keys stored in environment variables
- Request/response logging disabled for privacy
- Temperature set to 0.1 for consistent results
- JSON mode enabled to prevent injection attacks

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please follow responsible disclosure:

### DO NOT

- Open a public GitHub issue
- Discuss the vulnerability publicly
- Exploit the vulnerability

### DO

1. **Email**: Send details to [security@resumeforge.com] (replace with actual email)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Wait for response**: We aim to respond within 48 hours
4. **Allow time for fix**: Give us reasonable time to address the issue before public disclosure

### What to Expect

- Acknowledgment within 48 hours
- Regular updates on fix progress
- Credit in security advisories (if desired)
- Potential bug bounty (if program is active)

## Security Checklist for Deployment

Before deploying to production, ensure:

- [ ] All environment variables are set correctly
- [ ] HTTPS is enabled and enforced
- [ ] Database uses SSL/TLS connections
- [ ] Rate limiting is configured (preferably with Redis)
- [ ] Security headers are verified in browser dev tools
- [ ] File upload limits are appropriate
- [ ] Error messages don't leak sensitive information
- [ ] Logging is configured (but doesn't log sensitive data)
- [ ] Backup and recovery procedures are tested
- [ ] Dependencies are up to date (`npm audit`)
- [ ] CSP policy allows only necessary domains
- [ ] OAuth redirect URIs are whitelisted

## Security Updates

This document is updated as new security features are implemented or vulnerabilities are discovered.

**Last Updated**: November 2025

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [Prisma Security](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
