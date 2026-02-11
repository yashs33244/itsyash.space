# Complete Testing Guide for Photo Upload System

## All Fixes Implemented ✅

### 1. **No More 413 Error** 
- Switched from direct upload to **presigned URL upload**
- Files now upload directly to R2, bypassing Vercel's 4.5MB body limit
- **No file size limit** - upload as large as you want!

### 2. **Token Lasts 30 Days**
- JWT tokens now valid for 30 days (not 24 hours)
- Password stored in localStorage
- Page refresh won't log you out

### 3. **Fixed R2 Metadata**
- Removed newline characters from environment variables
- Photos will now save properly to `photos/photos.json`

### 4. **Enhanced Logging**
- Detailed console logs to debug any issues
- Check browser console (F12) for detailed information

---

## Step-by-Step Testing

### Test 1: Login & Token Persistence

1. Go to `https://itsyash.space/manage`
2. Enter password: `Yesitsme@Ironman`
3. Click "Sign In"
4. **Refresh the page** (F5)
5. ✅ **Expected**: Should still be logged in

**Console logs to look for:**
```
Loaded data from API: {photos: Array, settings: Object, categories: Array}
```

---

### Test 2: Upload Large Photo (No Size Limit!)

1. On `/manage` page
2. Click upload area or drag a photo
3. **Try uploading a large file** (5MB, 10MB, even 50MB+)
4. Wait for upload to complete
5. Edit modal should open with photo preview

**Console logs to look for:**
```
[Upload] Starting upload for file: photo.jpg 8388608 bytes
[Upload] Got presigned URL, uploading to R2...
[Upload] File uploaded successfully to R2: https://pub-...r2.dev/photos/...
```

---

### Test 3: Save Photo Metadata

1. In the edit modal that opened:
   - **Title**: "Test Mountain Photo" (required)
   - **Category**: Select "landscape" (required)
   - **Description**: "Beautiful sunrise" (optional)
   - **Location**: "Colorado, USA" (optional)
   - **Camera**: "Canon EOS R5" (optional)
   - **Aperture**: Select "f/8" from dropdown
   - **ISO**: "100"
   - **Shutter**: "1/125"
   - **Date**: Pick a date from date picker
2. Click "Save Photo"
3. Modal should close
4. Photo should appear in grid below

**Console logs to look for:**
```
[Save Photo] Starting: {isNewPhoto: true, photo: {...}, currentPhotoCount: 0}
[POST /api/photos] Received photo: {...}
[POST /api/photos] Writing updated data: {photoCount: 1, categories: [...]}
[writePhotosFile] Writing to R2: {bucket: "yashs3324", key: "photos/photos.json", photoCount: 1}
[writePhotosFile] Successfully wrote to R2
[Save Photo] Response: {ok: true, status: 200, photoCount: 1}
[Save Photo] Updating local state with 1 photos
```

---

### Test 4: Verify Photo Appears in Grid

1. On `/manage` page, scroll down to "All Photos"
2. Your uploaded photo should be visible
3. Title should match what you entered
4. Category label should show below title

**If photo doesn't appear:**
- Check console for errors
- Look for `[Save Photo] Response:` - should show `photoCount: 1` or higher
- If `photoCount: 0`, there's a save issue

---

### Test 5: Refresh Page - Data Persists

1. Refresh the `/manage` page (F5)
2. ✅ **Should still be logged in**
3. ✅ **Photo should still be in grid**

**Console log to look for:**
```
Loaded data from API: {photos: Array(1), settings: {...}, categories: Array(5)}
```

---

### Test 6: View on Photography Page

1. Go to `https://itsyash.space/photography`
2. Your photo should appear in the gallery grid
3. Click on your photo
4. Lightbox should open showing:
   - Full photo
   - Title
   - Description
   - Location, Camera
   - Settings (aperture, ISO, shutter speed combined)
   - Formatted date

**If photo doesn't appear on photography page:**
- Open browser console
- Check Network tab for `/api/photos` request
- Response should show your photos array

---

### Test 7: Set Category Hero Photo

1. Go back to `/manage`
2. Scroll to "Categories & Hero Photos" section
3. Find your photo's category (e.g., "landscape")
4. Click "Set Hero" button
5. Modal opens showing all photos in that category
6. Click your photo
7. Hero card should now show your photo with a star icon

**Console log to look for:**
```
[Save Settings] or similar indicating settings saved
```

---

### Test 8: Verify Hero on Photography Page

1. Go to `/photography`
2. Click on the category filter (e.g., "Landscape")
3. Hero background should change to your selected hero photo
4. Only photos from that category should show in grid

---

### Test 9: Edit Existing Photo

1. Go to `/manage`
2. Hover over your photo in grid
3. Click blue edit icon
4. Change title or description
5. Click "Save Photo"
6. Changes should be reflected immediately

---

### Test 10: Delete Photo

1. On `/manage`, hover over a photo
2. Click red trash icon
3. Confirm deletion
4. Photo should disappear from grid
5. Photo count in header should decrease

---

## Common Issues & Solutions

### Issue: 413 Error Still Appears
**Solution**: 
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- The new deployment uses presigned URLs which bypass the limit

### Issue: Photos Don't Appear After Saving
**Check Console For:**
```
[POST /api/photos] Response: {ok: true, photoCount: X}
[writePhotosFile] Successfully wrote to R2
```

**If you see errors:**
- Check if R2_METADATA_KEY environment variable is set correctly
- Verify no newline characters in env vars

### Issue: "Invalid or expired token" Error
**Solution:**
- Logout (click Logout button)
- Login again
- Token will be valid for 30 days now

### Issue: Photos Upload But Don't Save
**Check Console For:**
```
[Save Photo] Error: ...
```

**Possible causes:**
- Title field is empty (required)
- Category not selected (required)
- Network error to `/api/photos`

---

## API Testing (Advanced)

### Test GET /api/photos
```bash
curl https://itsyash.space/api/photos
```

**Expected:** JSON with photos array, settings, categories

### Test Authentication
```bash
# Get token
TOKEN=$(curl -s -X POST https://itsyash.space/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"password":"Yesitsme@Ironman"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

---

## Success Criteria Checklist

- [ ] Login works and persists on refresh
- [ ] Can upload photos of any size (no 413 error)
- [ ] Photo details save successfully
- [ ] Photos appear in /manage grid
- [ ] Photos persist after page refresh
- [ ] Photos appear on /photography page
- [ ] Can filter by category
- [ ] Can set hero photo for each category
- [ ] Hero photo changes when category filtered
- [ ] Can edit existing photos
- [ ] Can delete photos
- [ ] All console logs show successful operations

---

## URLs

- **Admin Panel**: https://itsyash.space/manage
- **Photography Gallery**: https://itsyash.space/photography
- **API Endpoint**: https://itsyash.space/api/photos

## Credentials

- **Password**: `Yesitsme@Ironman`
- **Token Duration**: 30 days

---

## What Changed in This Deployment

1. ✅ Upload method changed from direct upload to **presigned URL**
2. ✅ No more file size restrictions
3. ✅ Token expiry increased to **30 days**
4. ✅ Password stored in localStorage for persistence
5. ✅ Fixed R2 environment variables (removed newlines)
6. ✅ Added comprehensive console logging
7. ✅ Auto-reload after save to confirm data persistence

---

**Now Test Everything!** 🚀

Start with Test 1 and work through all 10 tests. If any test fails, check the console logs and refer to the "Common Issues & Solutions" section.
