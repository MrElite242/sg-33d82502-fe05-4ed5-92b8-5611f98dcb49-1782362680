# 🔐 Platform Owner Backdoor Access

## Security Notice
**THIS FILE CONTAINS SENSITIVE INFORMATION. DO NOT SHARE.**

## Overview
The admin login has been removed from public view. Only the platform owner can access the admin portal through a secure backdoor mechanism.

## How It Works

### 1. Backdoor Credentials
The owner backdoor uses environment variables for authentication:
- **Email:** Set in `NEXT_PUBLIC_OWNER_EMAIL`
- **Password:** Set in `NEXT_PUBLIC_OWNER_PASSWORD`

### 2. Default Credentials (CHANGE IMMEDIATELY)
```
Email: owner@cannablaze360.com
Password: CannaBlazeOwner4425!
```

### 3. Setup Instructions

#### Local Development:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set your custom credentials:
   ```env
   NEXT_PUBLIC_OWNER_EMAIL=your-secure-email@domain.com
   NEXT_PUBLIC_OWNER_PASSWORD=YourVeryStrongPassword123!@#
   ```

3. Never commit `.env.local` to git (already in .gitignore)

#### Vercel Deployment:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add these variables:
   - `NEXT_PUBLIC_OWNER_EMAIL` = your secure owner email
   - `NEXT_PUBLIC_OWNER_PASSWORD` = your strong password

3. Redeploy after adding variables

### 4. How to Login as Owner

1. Navigate to the normal login page: `https://cannablaze360.com/login`

2. **Do NOT select any role tab** - just use the login form directly

3. Enter your owner credentials:
   - Email: (your NEXT_PUBLIC_OWNER_EMAIL)
   - Password: (your NEXT_PUBLIC_OWNER_PASSWORD)

4. Click "Sign In" - you'll be redirected to `/admin-portal`

### 5. What's Hidden from Users

- ❌ No "Admin" role tab on login page
- ❌ No demo admin credentials shown
- ❌ No admin portal link in navigation
- ❌ No indication that admin access exists
- ✅ Only accessible with exact owner credentials
- ✅ Direct URL access to `/admin-portal` is blocked without auth

### 6. Security Best Practices

1. **Use a strong password:**
   - At least 16 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Not used anywhere else

2. **Use a private email:**
   - Not publicly associated with the platform
   - Not your main business email
   - Consider using a password manager email alias

3. **Rotate credentials periodically:**
   - Change password every 90 days
   - Update in both .env.local and Vercel

4. **Monitor admin access:**
   - Check activity logs regularly
   - Investigate any unexpected admin logins
   - Use 2FA if implementing it later

### 7. Emergency Access Recovery

If you lose access:
1. Access Vercel Dashboard → Environment Variables
2. Reset `NEXT_PUBLIC_OWNER_PASSWORD` to a new value
3. Redeploy
4. Use new password to login

### 8. Adding Additional Admins (Future)

If you want to add other admins later:
1. Login with owner backdoor
2. Go to admin portal → Users
3. Change a user's role to "admin" in the database
4. They can then login normally (no backdoor needed)

## Technical Details

### Implementation
- Backdoor check happens in `src/pages/login.tsx`
- Owner credentials stored in `localStorage` as `owner_admin_access`
- Admin portal checks for owner access in `src/pages/admin-portal.tsx`
- No UI elements expose admin functionality

### Files Modified
- `src/pages/login.tsx` - Removed admin tab, added backdoor check
- `src/pages/dashboard.tsx` - Removed admin portal link
- `src/pages/admin-portal.tsx` - Updated to use owner backdoor
- `.env.example` - Added owner credential template

### Backdoor Flow
```
User visits /login
  ↓
Enters owner email + password
  ↓
System checks if credentials match env vars
  ↓
If match: Set owner_admin_access in localStorage
  ↓
Redirect to /admin-portal
  ↓
Admin portal verifies owner_admin_access exists
  ↓
Grant full admin access
```

## Questions or Issues?

If you need to modify the backdoor logic or have security concerns, the code is in:
- `src/pages/login.tsx` (lines 20-46)
- `src/pages/admin-portal.tsx` (lines 71-89)

---

**🔒 KEEP THIS FILE SECURE. DO NOT COMMIT TO PUBLIC REPOSITORIES.**