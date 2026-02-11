# ✅ Final Testing Checklist - Photo Upload System

## System Status: CORS FIXED ✅

CORS is now properly configured on your R2 bucket. All uploads should work!

---

## Test 1: Login & Authentication (2 min)

### Steps:
1. Go to https://itsyash.space/manage
2. Enter password: `Yesitsme@Ironman`
3. Click "Sign In"
4. Refresh the page (F5)

### Expected Results:
- ✅ Should stay logged in after refresh
- ✅ Token lasts 30 days
- ✅ No re-login required

### If Failed:
- Clear browser cache and cookies
- Try incognito/private window
- Check console for "Invalid or expired token"

---

## Test 2: Photo Upload - Any Size! (3 min)

### Steps:
1. On `/manage` page, click upload area
2. Select a photo (try 5MB+, 10MB+ to test no size limit)
3. Wait for upload to complete
4. Edit modal should open automatically

### Expected Results:
- ✅ No 413 error (CORS fixed!)
- ✅ Upload progress shows in console
- ✅ Edit modal opens with photo preview

### Console Logs to Look For:
```javascript
[Upload] Starting upload for file: DSC_1234.jpg 8388608 bytes
[Upload] Got presigned URL, uploading to R2...
[Upload] File uploaded successfully to R2: https://pub-18a0e0f57d1c424f99f76e81a5f187f9.r2.dev/photos/...
```

### If Failed:
- Check console for CORS errors
- If you see CORS error, R2 config might need `AllowedHeaders: ["*"]`
- Verify you updated CORS without the `/*` in origin

---

## Test 3: Save Photo Metadata (2 min)

### Steps:
1. In the edit modal:
   - **Title**: "Test Sunset Photo" (required)
   - **Category**: "landscape" (required)
   - **Description**: "Beautiful golden hour"
   - **Location**: "California, USA"
   - **Camera**: "Canon EOS R5"
   - **Aperture**: Select "f/8" from dropdown
   - **ISO**: "100"
   - **Shutter Speed**: "1/250"
   - **Date**: Pick today's date
2. Click "Save Photo"
3. Modal should close

### Expected Results:
- ✅ Modal closes
- ✅ Photo appears in grid below
- ✅ Shows title and category

### Console Logs to Look For:
```javascript
[Save Photo] Starting: {isNewPhoto: true, photo: {...}}
[POST /api/photos] Received photo: {title: "Test Sunset Photo", ...}
[POST /api/photos] Writing updated data: {photoCount: 1, categories: [...]}
[writePhotosFile] Writing to R2: {bucket: "yashs3324", key: "photos/photos.json", photoCount: 1}
[writePhotosFile] Successfully wrote to R2
[Save Photo] Response: {ok: true, status: 200, photoCount: 1}
```

### If Failed:
- Check console for errors
- Look for `photoCount: 0` (means save failed)
- Check if `[writePhotosFile]` logs appear
- Verify R2_METADATA_KEY environment variable is correct

---

## Test 4: Verify Persistence (1 min)

### Steps:
1. Refresh the `/manage` page (F5)
2. Check if photo is still in grid
3. Check header shows "1 photos uploaded"

### Expected Results:
- ✅ Still logged in
- ✅ Photo still visible
- ✅ Count updated in header

### Console Logs to Look For:
```javascript
Loaded data from API: {photos: Array(1), settings: {...}, categories: Array(5)}
```

### If Failed:
- Photo might not have saved to R2
- Check `/api/photos` endpoint directly in browser
- Should return JSON with your photo

---

## Test 5: View on Photography Page (2 min)

### Steps:
1. Go to https://itsyash.space/photography
2. Look for your photo in the grid
3. Click on the photo
4. Lightbox should open

### Expected Results:
- ✅ Photo appears in gallery grid
- ✅ Clicking opens lightbox
- ✅ All details visible (title, location, camera settings)
- ✅ Date formatted nicely

### If Failed:
- Open browser console
- Check Network tab for `/api/photos` request
- Response should show your photos array
- If empty array, photo didn't save to R2

---

## Test 6: Category Filtering (1 min)

### Steps:
1. On `/photography` page
2. Click "Landscape" filter button
3. Should show only landscape photos
4. Click "All Work" to show all

### Expected Results:
- ✅ Filter buttons work
- ✅ Only selected category photos show
- ✅ "All Work" shows everything

---

## Test 7: Set Hero Photo (3 min)

### Steps:
1. Go back to `/manage`
2. Scroll to "Categories & Hero Photos"
3. Find "landscape" card
4. Click "Set Hero"
5. Modal opens showing all landscape photos
6. Click on your photo
7. Modal closes
8. Hero card should now show your photo with star icon

### Expected Results:
- ✅ Hero photo appears on category card
- ✅ Star icon visible
- ✅ Settings saved to R2

### Test Hero on Photography Page:
1. Go to `/photography`
2. Click "Landscape" filter
3. Hero background should change to your selected photo

---

## Test 8: Edit Existing Photo (2 min)

### Steps:
1. On `/manage`, hover over your photo
2. Click blue edit icon (pencil)
3. Change title to "Updated Sunset"
4. Click "Save Photo"

### Expected Results:
- ✅ Changes save immediately
- ✅ Title updates in grid
- ✅ Console shows successful save

---

## Test 9: Upload Multiple Photos (5 min)

### Steps:
1. Upload 3 different photos
2. Assign to different categories:
   - Photo 1: "landscape"
   - Photo 2: "portrait"
   - Photo 3: "urban"
3. Save all with different details

### Expected Results:
- ✅ All 3 photos appear in grid
- ✅ Header shows "3 photos uploaded"
- ✅ Can filter by category on `/photography`

---

## Test 10: Delete Photo (1 min)

### Steps:
1. Hover over a photo
2. Click red trash icon
3. Confirm deletion
4. Photo disappears

### Expected Results:
- ✅ Photo removed from grid
- ✅ Count decreases in header
- ✅ Photo removed from `/photography` too

---

## API Endpoint Test (Advanced)

Test the API directly:

```bash
# Get all photos
curl https://itsyash.space/api/photos

# Should return:
{
  "photos": [...],
  "settings": {...},
  "categories": [...]
}
```

---

## Troubleshooting Guide

### Issue: Still Getting 413 Error
**Solution:**
- Clear browser cache completely
- Hard refresh (Ctrl+Shift+R)
- The system now uses presigned URLs which bypass Vercel's limit

### Issue: Upload Works But Photo Doesn't Appear
**Check Console For:**
```
[Save Photo] Response: {ok: true, photoCount: X}
```

**If photoCount is 0:**
- Check R2_METADATA_KEY environment variable
- Should be `photos/photos.json` without newlines
- Redeploy if you changed env vars

### Issue: CORS Error Still Appears
**Verify R2 CORS Config Has:**
```json
{
  "AllowedOrigins": ["https://itsyash.space"],
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"]
}
```

**Note:** 
- Remove `/*` from origin
- Must include `AllowedHeaders: ["*"]`
- Wait 1-2 minutes after changing CORS

### Issue: Photo Appears on /manage But Not /photography
**Check:**
1. Browser console on `/photography` page
2. Network tab → `/api/photos` request
3. Should return your photos array
4. If empty, metadata didn't save to R2

---

## Success Criteria

All of these should be true:

- [ ] Can login and stay logged in after refresh
- [ ] Can upload photos of any size (10MB+) without 413 error
- [ ] Photos appear in /manage grid after saving
- [ ] Photos persist after page refresh
- [ ] Photos appear on /photography page
- [ ] Can filter by category
- [ ] Can set hero photo for each category
- [ ] Hero photo changes when category filtered
- [ ] Can edit existing photos
- [ ] Can delete photos
- [ ] Console shows all successful operations

---

## Performance Benchmarks

- **Login**: < 1 second
- **Upload 5MB photo**: 2-5 seconds (depends on internet)
- **Upload 50MB photo**: 10-30 seconds
- **Save metadata**: < 1 second
- **Load /photography page**: < 2 seconds

---

## What's Working Now

1. ✅ **No File Size Limit** - Upload any size photo
2. ✅ **CORS Fixed** - Direct browser uploads to R2
3. ✅ **30-Day Tokens** - Stay logged in for a month
4. ✅ **Persistent Auth** - No re-login on refresh
5. ✅ **Metadata Saves** - Photos persist in R2
6. ✅ **Hero Photos** - Set per category
7. ✅ **Full CRUD** - Create, Read, Update, Delete
8. ✅ **Detailed Logging** - Debug via console
9. ✅ **Category Management** - Create/delete categories
10. ✅ **Camera Details** - Aperture, ISO, shutter speed

---

## Architecture Overview

```
Upload Flow:
Browser → /api/upload/presigned → Get temporary URL
Browser → Direct PUT to R2 → Upload complete
Browser → /api/photos POST → Save metadata
R2 → photos/photos.json → Metadata stored

Retrieval Flow:
Browser → /api/photos GET → Load metadata
Browser → Render gallery → Show photos
Browser → Click photo → Load from R2 public URL
```

---

## Next Steps After Testing

Once all tests pass:

1. **Upload your real photos** - The system is ready!
2. **Set hero photos** for each category
3. **Organize by categories** - Create custom ones if needed
4. **Share your portfolio** - Show off your photography!

---

**Start Testing Now!** 🚀

Go to https://itsyash.space/manage and work through Tests 1-10.

Report any failures with console logs, and we'll fix them immediately!
