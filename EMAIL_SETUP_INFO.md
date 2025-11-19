# ⚠️ IMPORTANT: Email Configuration

## Authentication Setup

This project is configured for **immediate signup without email verification**.

### Why No Email Verification?

Since only `@bennett.edu.in` email addresses are allowed:
- Email domain validation happens at the **application level**
- Users can sign up and login **immediately**
- No waiting for verification emails
- Faster onboarding experience

### Supabase Configuration Required

**CRITICAL:** You MUST disable email confirmations in Supabase:

1. Go to Supabase Dashboard
2. **Authentication** → **Settings**
3. Find "Enable email confirmations"
4. **UNCHECK/DISABLE** this option
5. Save changes

### What Happens During Signup

1. User enters details (name, email, phone, password)
2. System validates email ends with `@bennett.edu.in`
3. Account is created in Supabase Auth
4. User profile is created in database
5. Team is created (if participating)
6. **User can login immediately** - no email verification step

### Email Validation

- **Client-side**: Checks `@bennett.edu.in` domain in signup form
- **Server-side**: API validates email domain before creating account
- **Database**: Stores email but no verification status needed

### For Deployment

#### Local (.env.local)
No special email configuration needed

#### Production (Vercel + Supabase)
1. Set environment variables in Vercel
2. Update Supabase Auth URLs:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`
3. **Ensure email confirmations are DISABLED**

### Testing

```bash
# Signup flow
1. Visit /signup
2. Enter @bennett.edu.in email
3. Submit form
4. ✅ Account created immediately
5. Go to /login
6. ✅ Login works right away
```

### Common Issues

**Problem:** "Email not confirmed" error
- **Solution:** Disable email confirmations in Supabase Auth settings

**Problem:** Can't login after signup
- **Solution:** Check that email confirmations are disabled in Supabase

**Problem:** Non-Bennett emails can sign up
- **Solution:** Application validates domain - check API route validation

### Security Notes

✅ Only `@bennett.edu.in` emails accepted  
✅ Domain validation at API level  
✅ Row Level Security on all tables  
✅ Protected routes with middleware  
✅ No email verification = faster UX, domain restriction = security  

### If You Want Email Verification Later

To enable email verification in the future:

1. Enable email confirmations in Supabase
2. Update signup API to handle confirmation
3. Add email verification UI
4. Update documentation

But for a Bennett-only portal, domain validation without email verification is sufficient.
