// Email validation
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password strength validation
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
    return { valid: true };
}

// File validation
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024; // Default 10MB

export function validateFile(file: File): { valid: boolean; message?: string } {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, message: 'Invalid file type. Only PDF and DOCX files are allowed.' };
    }
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.` };
    }
    return { valid: true };
}

// Text sanitization (basic XSS prevention)
export function sanitizeText(text: string, maxLength: number = 10000): string {
    // Remove any HTML tags
    let sanitized = text.replace(/<[^>]*>/g, '');
    // Trim to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    return sanitized.trim();
}
