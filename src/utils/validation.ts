/**
 * Password validation utility
 * Matches backend validation requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates password against requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Trim the password - spaces will be silently removed
  const trimmedPassword = password.trim();

  if (trimmedPassword.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(trimmedPassword)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(trimmedPassword)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(trimmedPassword)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmedPassword)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if passwords match
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * Get password strength indicator
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  const validation = validatePassword(password);
  
  if (password.length === 0) return 'weak';
  
  const errorCount = validation.errors.length;
  
  if (errorCount >= 3) return 'weak';
  if (errorCount >= 1) return 'medium';
  return 'strong';
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
  }
}
