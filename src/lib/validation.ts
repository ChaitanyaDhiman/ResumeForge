// Email validation with stricter regex
export function isValidEmail(email: string): boolean {
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Additional checks
    if (!emailRegex.test(email)) {
        return false;
    }

    // Check for common typos and invalid patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
        return false;
    }

    return true;
}

// Password strength validation with special character requirement
export function isStrongPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    // Add special character requirement
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true };
}

// File validation with extension checking
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024; // Default 10MB

export function validateFile(file: File): { valid: boolean; message?: string } {
    // Check MIME type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, message: 'Invalid file type. Only PDF and DOCX files are allowed.' };
    }

    // Check file extension as additional security measure
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
        return { valid: false, message: 'Invalid file extension. Only .pdf, .doc, and .docx files are allowed.' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.` };
    }

    return { valid: true };
}

// Enhanced text sanitization (XSS prevention)
export function sanitizeText(text: string, maxLength: number = 10000): string {
    // Remove HTML tags and potentially dangerous patterns
    let sanitized = text
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: protocol (can be used for XSS)
        .replace(/data:text\/html/gi, '');

    // Trim to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized.trim();
}
