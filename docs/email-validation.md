# Bennett University Email Validation Rules

## Overview
This document outlines the email validation rules implemented for the Project Showcase platform, based on the organization's Microsoft Azure AD user directory.

## Allowed Email Domains

Based on the analysis of `exportUsers_2025-11-20.csv` containing Bennett University's user directory, the following email patterns are allowed:

### 1. Primary Bennett Domain
- **Pattern**: `*@bennett.edu.in`
- **Examples**:
  - `student.name@bennett.edu.in`
  - `E21CSEU0001@bennett.edu.in`
  - `M20BBA109@bennett.edu.in`
  - `faculty.name@bennett.edu.in`
  - `AS3432P@bennett.edu.in`

### 2. Microsoft 365 Domain
- **Pattern**: `*@bennettu.onmicrosoft.com`
- **Examples**:
  - `3mt@bennettu.onmicrosoft.com`
  - `drlalitharao@bennettu.onmicrosoft.com`

## Blocked Email Patterns

### External Guest Accounts
- **Pattern**: Any email containing `#EXT#`
- **Reason**: These are external guest accounts invited to the organization
- **Examples** (BLOCKED):
  - `11.manvijain_gmail.com#EXT#@bennettu.onmicrosoft.com`
  - `19010125446_symlaw.ac.in#EXT#@bennettu.onmicrosoft.com`
  - `1911603_iiitdmj.ac.in#EXT#@bennettu.onmicrosoft.com`

## Implementation

### Server-Side Validation
Location: `/app/api/auth/signup/route.ts`

```typescript
import { isValidBennettEmail, getBennettEmailError } from '@/lib/email-validation'

// Validates user email
if (!isValidBennettEmail(email)) {
  return NextResponse.json(
    { error: getBennettEmailError(email) },
    { status: 400 }
  )
}

// Validates team member emails
const invalidMembers = teamData.members
  .filter(member => member.email)
  .filter(member => !isValidBennettEmail(member.email))
```

### Client-Side Validation
Location: `/app/signup/page.tsx`

```typescript
const emailLower = formData.email.toLowerCase().trim()
const isValidEmail = (
  emailLower.endsWith('@bennett.edu.in') || 
  emailLower.endsWith('@bennettu.onmicrosoft.com')
) && !emailLower.includes('#ext#')
```

### Utility Functions
Location: `/lib/email-validation.ts`

- `isValidBennettEmail(email)` - Validates a single email
- `getBennettEmailError(email)` - Returns user-friendly error message
- `validateBennettEmails(emails)` - Validates multiple emails (bulk)

## User Experience

### Error Messages
- **Invalid domain**: "Only Bennett University email addresses (@bennett.edu.in or @bennettu.onmicrosoft.com) are allowed."
- **External guest**: "External guest accounts are not permitted to sign up. Please use your Bennett University email address."
- **Invalid team member**: "Invalid team member email(s): [email]. Only Bennett University emails are allowed."

### UI Hints
- Placeholder text: `your.name@bennett.edu.in or @bennettu.onmicrosoft.com`
- Help text: "ℹ️ Only Bennett University email addresses (@bennett.edu.in or @bennettu.onmicrosoft.com) are allowed"

## Security Considerations

1. **Case-Insensitive**: All email validation is case-insensitive
2. **Trimmed**: Leading/trailing whitespace is removed
3. **Server-Side Enforcement**: Primary validation happens on the server
4. **Client-Side Feedback**: Immediate feedback for better UX
5. **Team Member Validation**: All team members must also have valid Bennett emails

## Data Source
The validation rules are based on the organization's user directory exported from Microsoft Azure AD on November 20, 2025 (`exportUsers_2025-11-20.csv`).

## Maintenance

If new email domains are added to the organization:
1. Update `BENNETT_EMAIL_DOMAINS` in `/lib/email-validation.ts`
2. Update validation logic in `isValidBennettEmail()`
3. Update placeholder and help text in signup form
4. Update this documentation

## Testing

Valid emails to test:
- `test.user@bennett.edu.in` ✅
- `E23CSEU0001@bennett.edu.in` ✅
- `admin@bennettu.onmicrosoft.com` ✅

Invalid emails to test:
- `user@gmail.com` ❌
- `external_gmail.com#EXT#@bennettu.onmicrosoft.com` ❌
- `user@other-university.edu` ❌
