# Fix CORS Error - Configure R2 Bucket

## The Problem

Your R2 bucket is blocking uploads from the browser because of CORS (Cross-Origin Resource Sharing) policy. The bucket needs to allow requests from `https://itsyash.space`.

## Solution: Configure CORS in Cloudflare Dashboard

### Step 1: Go to Cloudflare R2 Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **R2** in the left sidebar
3. Click on your bucket: **yashs3324**

### Step 2: Configure CORS Settings

1. Click on the **Settings** tab
2. Scroll down to find **CORS Policy** section
3. Click **Edit** or **Add CORS Policy**

### Step 3: Add This CORS Configuration

**Copy and paste this exact JSON:**

```json
[
  {
    "AllowedOrigins": [
      "https://itsyash.space",
      "http://localhost:3000",
      "https://*.vercel.app"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length",
      "Content-Type"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### Step 4: Save and Verify

1. Click **Save** or **Apply**
2. Wait 30 seconds for changes to propagate
3. Try uploading a photo again from https://itsyash.space/manage

---

## Alternative: Use Cloudflare Wrangler CLI

If the dashboard doesn't have a CORS section, use Wrangler CLI:

### 1. Install Wrangler (if not installed)
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Create CORS config file

Create a file called `r2-cors.json`:
```json
[
  {
    "AllowedOrigins": [
      "https://itsyash.space",
      "http://localhost:3000",
      "https://*.vercel.app"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

### 4. Apply CORS to bucket
```bash
wrangler r2 bucket cors put yashs3324 --file r2-cors.json
```

### 5. Verify CORS is set
```bash
wrangler r2 bucket cors get yashs3324
```

---

## What This CORS Config Does

- **AllowedOrigins**: Allows uploads from your website and local development
- **AllowedMethods**: Allows GET (download), PUT (upload), DELETE (remove)
- **AllowedHeaders**: Allows all request headers (needed for authentication)
- **ExposeHeaders**: Allows browser to read response headers
- **MaxAgeSeconds**: Browser caches CORS policy for 1 hour

---

## After Setting CORS

1. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
3. **Try uploading again** at https://itsyash.space/manage

The upload should now work without CORS errors!

---

## Visual Guide for Cloudflare Dashboard

```
Cloudflare Dashboard
└── R2
    └── yashs3324 (your bucket)
        └── Settings tab
            └── CORS Policy section
                └── Edit / Add Policy
                    └── Paste JSON config
                    └── Save
```

---

## Troubleshooting

### Issue: Can't find CORS Policy in Settings

**Solution:** Use Wrangler CLI method instead (see above)

### Issue: Still getting CORS error after setting

**Solutions:**
1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache completely
3. Try in incognito/private window
4. Check browser console - the error should disappear

### Issue: Wrangler command not found

**Solution:**
```bash
npm install -g wrangler
# or
npm install wrangler --save-dev
npx wrangler r2 bucket cors put yashs3324 --file r2-cors.json
```

---

## Need Help?

If you continue to get CORS errors after setting this up:

1. Check browser console for the exact error
2. Verify the CORS policy was saved:
   ```bash
   wrangler r2 bucket cors get yashs3324
   ```
3. Make sure you're accessing from `https://itsyash.space` (not localhost)

---

**Once CORS is configured, your photo uploads will work perfectly!** 🎉
