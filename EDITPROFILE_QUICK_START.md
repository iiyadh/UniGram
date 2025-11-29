# Edit Profile Feature - Quick Integration Checklist

## Prerequisites
- [x] Backend API Gateway running
- [x] Authentication Service running
- [x] Reference Service running
- [x] Database configured
- [ ] Cloudinary account created

## Step-by-Step Setup

### 1. Cloudinary Setup (5 minutes)
```
[ ] Create Cloudinary account at cloudinary.com
[ ] Get Cloud Name from Dashboard
[ ] Get API Key from Dashboard
[ ] Get API Secret from Dashboard
[ ] Add credentials to ref-service/.env
```

### 2. Backend Dependencies (2 minutes)
```bash
cd ref-service
npm install cloudinary@^2.0.0 multer-storage-cloudinary@^4.0.0
```

Or manually add to `ref-service/package.json`:
```json
"cloudinary": "^2.0.0",
"multer-storage-cloudinary": "^4.0.0"
```

### 3. Environment Variables (2 minutes)
In `ref-service/.env`, add:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Verification (2 minutes)
Verify users table has these columns:
- ✓ id
- ✓ name
- ✓ email
- ✓ password
- ✓ imgURL (for profile picture)
- ✓ cin
- ✓ created_at
- ✓ updated_at

### 5. File Updates (1 minute)
The following files have been created/updated:

**Frontend:**
- ✓ `client/src/Components/EditProfile.jsx` - NEW (Complete component)

**Backend:**
- ✓ `ref-service/controllers/profileController.js` - UPDATED (Added 3 functions)
- ✓ `ref-service/routes/editprofileRoute.js` - UPDATED (Added new endpoints)
- ✓ `ref-service/lib/multerConfig.js` - UPDATED (Cloudinary integration)

### 6. Import in Your App (1 minute)
In your page/layout that uses EditProfile:
```jsx
import EditProfile from './Components/EditProfile';

// Then use it in your component
<EditProfile />
```

### 7. Test the Feature (5 minutes)
```
[ ] Start all services
[ ] Navigate to Edit Profile
[ ] Load existing profile data
[ ] Try updating name
[ ] Try updating email
[ ] Try uploading image
[ ] Try changing password
[ ] Try invalid inputs (validation)
[ ] Check success messages
```

## Service URLs Configuration

Make sure in `client/src/api/interceptor.js` your `VITE_BASE_URL` includes:

```env
VITE_BASE_URL=http://localhost:3000  # or your API Gateway URL
```

The EditProfile component will call:
- `GET /ref/api/ref/editprofile` - Get profile
- `PUT /ref/api/ref/editprofile` - Update profile
- `POST /ref/api/ref/editprofile/upload-image` - Upload image

## API Gateway Routes

If using API Gateway, add routes:
```javascript
app.use('/ref/api/ref/', refServiceRouter);
```

This ensures requests are forwarded correctly.

## Supported Features

✓ Update Full Name
✓ Update Email Address
✓ Update Password (with strength validation)
✓ Upload Profile Picture (Cloudinary)
✓ Auto-crop images with face detection
✓ Form validation
✓ Password confirmation matching
✓ Error handling and notifications
✓ Read-only CIN display
✓ Responsive design

## Field Requirements

| Field | Type | Requirements |
|-------|------|--------------|
| Name | String | Min 2, Max 100 chars |
| Email | Email | Valid format, unique |
| Password | String | Min 6 chars, uppercase + lowercase + number |
| Confirm Password | String | Must match password |
| Image | File | JPG/PNG/GIF/WebP, Max 5MB |

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| Image upload fails | Check Cloudinary credentials in .env |
| "Email already in use" error | Use a different email address |
| Passwords don't match | Ensure both passwords are identical |
| Page loads blank | Check console for token/auth errors |
| API returns 401 | Ensure valid JWT token is present |

## Testing Credentials Format

**Valid Password Examples:**
- ✓ MyPassword123
- ✓ SecurePass456
- ✓ TestCode789
- ✗ password (no uppercase or number)
- ✗ PASSWORD123 (no lowercase)
- ✗ password (too short)

**Valid Email Format:**
- ✓ user@example.com
- ✓ name.surname@domain.co.uk
- ✗ user@domain (no extension)
- ✗ @example.com (no local part)

## Running Tests

**Test Profile Update:**
```bash
# In separate terminals:
Terminal 1: cd auth-service && npm start
Terminal 2: cd ref-service && npm start
Terminal 3: cd client && npm run dev
```

Then navigate to the Edit Profile page in your app.

## After Setup Verification

Run this to verify everything is working:

1. **Check Backend:**
   - [ ] Services start without errors
   - [ ] Console shows "✅ All tables and triggers created"

2. **Check Frontend:**
   - [ ] Page loads without errors
   - [ ] Profile data displays correctly
   - [ ] Form fields render properly

3. **Check API:**
   - [ ] GET request returns profile data
   - [ ] PUT request updates profile
   - [ ] Image upload returns success

## Rollback if Needed

If you need to revert changes:
```bash
# Restore original files
git checkout ref-service/routes/editprofileRoute.js
git checkout ref-service/controllers/profileController.js
git checkout ref-service/lib/multerConfig.js
git checkout client/src/Components/EditProfile.jsx
```

## Need Help?

Check the detailed guide: `EDITPROFILE_SETUP_GUIDE.md`

This contains:
- Complete architecture explanation
- Validation rules
- Error handling guide
- cURL testing examples
- Security considerations
- Performance optimization tips
