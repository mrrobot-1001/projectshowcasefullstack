# Vercel Deployment Fix

## Issue
Vercel deployment was failing with:
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" 
because pnpm-lock.yaml is not up to date with package.json
```

## Root Cause
- Project initially used `pnpm` lock file
- Added new Supabase dependencies using `npm`
- Lock file was out of sync with package.json

## Solution Applied

### 1. Removed pnpm lock file
```bash
rm pnpm-lock.yaml
```

### 2. Generated npm lock file
```bash
npm install --legacy-peer-deps
```

(Used `--legacy-peer-deps` to resolve React version conflicts with vaul package)

### 3. Committed changes
```bash
git add .
git commit -m "Add backend implementation and remove email verification"
git push origin main
```

## Result
- ✅ Removed `pnpm-lock.yaml`
- ✅ Generated `package-lock.json`
- ✅ Vercel now uses npm for installation
- ✅ Deployment should proceed successfully

## For Future Deployments

The project now uses **npm** instead of pnpm.

### To add dependencies:
```bash
npm install <package-name> --legacy-peer-deps
```

### To update dependencies:
```bash
npm update --legacy-peer-deps
```

### Why --legacy-peer-deps?
The `vaul` package (used in UI components) requires React 18, but the project uses React 19. The `--legacy-peer-deps` flag allows npm to proceed despite this peer dependency mismatch.

## Vercel Configuration

Vercel will automatically detect `package-lock.json` and use npm for installation.

No additional configuration needed in `vercel.json`.

## Next Deployment

After pushing the changes, Vercel should automatically:
1. Detect the new commit
2. Start a new deployment
3. Use `npm install` (instead of pnpm)
4. Build successfully

Monitor the deployment at: https://vercel.com/dashboard

## If Deployment Still Fails

Check:
1. ✅ All environment variables are set in Vercel
2. ✅ package-lock.json is committed
3. ✅ No pnpm-lock.yaml exists
4. ✅ Build command is correct: `next build`

## Environment Variables Required in Vercel

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Make sure all are set before deployment!
