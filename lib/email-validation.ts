/**
 * Email validation utilities for Bennett University
 * Based on organization's email patterns from Microsoft Azure AD
 */

/**
 * Validates if an email is a valid Bennett University email
 * 
 * Allowed domains:
 * - @bennett.edu.in (Primary Bennett domain)
 * - @bennettu.onmicrosoft.com (Microsoft 365 domain)
 * 
 * Blocked:
 * - External guest accounts (containing #EXT#)
 * 
 * @param email - The email address to validate
 * @returns true if valid Bennett email, false otherwise
 */
export function isValidBennettEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  const normalizedEmail = email.toLowerCase().trim()
  
  // Allowed Bennett University email domains
  const allowedDomains = [
    '@bennett.edu.in',           // Primary Bennett domain
    '@bennettu.onmicrosoft.com'  // Microsoft 365 domain
  ]
  
  // Check if email ends with any allowed domain
  const hasAllowedDomain = allowedDomains.some(domain => 
    normalizedEmail.endsWith(domain)
  )
  
  // Block external guest accounts (marked with #EXT# in organization)
  const isExternalGuest = normalizedEmail.includes('#ext#')
  
  // Must have allowed domain AND not be an external guest
  return hasAllowedDomain && !isExternalGuest
}

/**
 * Gets a user-friendly error message for invalid emails
 * 
 * @param email - The email address that failed validation
 * @returns Error message string
 */
export function getBennettEmailError(email: string): string {
  const normalizedEmail = email.toLowerCase().trim()
  
  if (normalizedEmail.includes('#ext#')) {
    return 'External guest accounts are not permitted to sign up. Please use your Bennett University email address.'
  }
  
  return 'Only Bennett University email addresses (@bennett.edu.in or @bennettu.onmicrosoft.com) are allowed.'
}

/**
 * Validates multiple emails (e.g., team members)
 * 
 * @param emails - Array of email addresses to validate
 * @returns Object with isValid boolean and array of invalid emails
 */
export function validateBennettEmails(emails: string[]): {
  isValid: boolean
  invalidEmails: string[]
} {
  const invalidEmails = emails.filter(email => 
    email && !isValidBennettEmail(email)
  )
  
  return {
    isValid: invalidEmails.length === 0,
    invalidEmails
  }
}

/**
 * Email domain constants for Bennett University
 */
export const BENNETT_EMAIL_DOMAINS = {
  PRIMARY: '@bennett.edu.in',
  MICROSOFT: '@bennettu.onmicrosoft.com'
} as const

/**
 * Example valid email patterns from the organization
 */
export const BENNETT_EMAIL_EXAMPLES = [
  'student.name@bennett.edu.in',
  'E21CSEU0001@bennett.edu.in',
  'faculty.name@bennett.edu.in',
  'name@bennettu.onmicrosoft.com'
] as const
