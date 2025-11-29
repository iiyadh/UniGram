# Edit Profile Feature - Setup Guide

## Overview
The Edit Profile feature allows users to update their profile information including:
- Full Name
- Email Address
- Profile Picture (via Cloudinary API)
- Password (with confirmation)

## Architecture

### Frontend (EditProfile.jsx)
Located at: `client/src/Components/EditProfile.jsx`

**Features:**
- Clean, user-friendly UI using Ant Design components
- Profile picture upload with preview
- Form validation for all fields
- Password strength validation (uppercase, lowercase, numbers)
- Password confirmation matching
- Read-only CIN display
- Real-time feedback with success/error messages

**API Endpoints Used:**
- `GET /ref/api/ref/editprofile` - Fetch current profile data
- `PUT /ref/api/ref/editprofile` - Update profile (name, email, password)
- `POST /ref/api/ref/editprofile/upload-image` - Upload profile picture

### Backend (ref-service)
Located at: `ref-service/`

**Controller:** `controllers/profileController.js`
- `getProfile()` - Retrieve user profile by ID
- `editProfile()` - Update profile with validation
- `uploadProfileImage()` - Handle Cloudinary image upload

**Routes:** `routes/editprofileRoute.js`
- All routes require authentication (validateAuth middleware)
- Image upload uses multer with Cloudinary storage

**Middleware:** `middlewares/checkAuth.js`
- Validates JWT token
- Extracts user ID from token

---

## Installation & Configuration

### Step 1: Install Backend Dependencies

In the `ref-service` directory, add the following dependencies to `package.json`:

```json
"cloudinary": "^2.0.0",
"multer": "^2.0.2",
"multer-storage-cloudinary": "^4.0.0"
```

Then run:
```bash
cd ref-service
npm install
```

### Step 2: Set Up Environment Variables

Create or update `.env` file in `ref-service/` with your Cloudinary credentials:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

# Server
PORT=6000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
```

### Step 3: Get Cloudinary Credentials

1. Sign up at [Cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret
4. Add these to your `.env` file

### Step 4: Verify Database Schema

The users table should have the following fields:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  cin TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imgURL TEXT,
  account_status TEXT CHECK (account_status IN ('active', 'inactive', 'blocked')) DEFAULT 'inactive',
  role TEXT CHECK (role IN ('student', 'teacher', 'admin', 'chef')) DEFAULT 'student',
  reset_token TEXT,
  reset_token_expires TIMESTAMP
);
```

---

## Usage

### For Users

1. **Access the Edit Profile Page**
   - Navigate to your profile settings
   - Click on the Edit Profile component

2. **Update Profile Picture**
   - Click "Change Picture" button
   - Select an image file (JPG, PNG, GIF, WebP)
   - Max file size: 5MB
   - Image will be auto-cropped to 500x500px with face detection

3. **Update Personal Information**
   - Full Name: Minimum 2 characters
   - Email: Must be valid email format
   - CIN: Read-only field

4. **Change Password (Optional)**
   - Enter new password (minimum 6 characters)
   - Password must contain:
     - At least one uppercase letter
     - At least one lowercase letter
     - At least one number
   - Enter confirmation password
   - Passwords must match

5. **Save Changes**
   - Click "Save Changes" button
   - Success message will appear
   - Password fields will be cleared

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated profile data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Validation Rules

### Email Validation
- Format: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Must be unique in database
- Cannot be blank

### Name Validation
- Minimum: 2 characters
- Maximum: 100 characters
- Cannot be blank

### Password Validation
- Minimum: 6 characters
- Pattern: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`
  - Must contain lowercase letter
  - Must contain uppercase letter
  - Must contain number
- Optional field (only updates if filled)

### Image Validation
- Allowed formats: JPG, JPEG, PNG, GIF, WebP
- Maximum size: 5MB
- Will be resized to 500x500px
- Face detection enabled for cropping

---

## Code Structure

### Frontend Components

**EditProfile.jsx** includes:
- Profile picture section with Avatar display
- Upload component with Cloudinary integration
- Form with validation rules
- Password strength validation
- Confirm password matching
- Success/Error notifications
- Responsive design with Ant Design styling

### Backend Functions

**profileController.js:**
```javascript
getProfile(req, res)           // GET profile
editProfile(req, res)          // UPDATE profile
uploadProfileImage(req, res)   // UPLOAD image
```

**Validation included:**
- Email format validation
- Password strength validation
- Duplicate email detection
- File type and size validation

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Email already in use" | Email exists in database | Use different email |
| "Passwords do not match" | Confirm password != password | Re-enter matching passwords |
| "Invalid email format" | Email doesn't match regex | Use valid email format |
| "Image size must not exceed 5MB" | File too large | Reduce image size |
| "Failed to upload image" | Cloudinary issue | Check API credentials |
| "Password must contain..." | Weak password | Add uppercase, lowercase, number |

---

## Testing

### Manual Testing Checklist

- [ ] Can load profile page without errors
- [ ] Profile data displays correctly
- [ ] Can update name successfully
- [ ] Can update email successfully
- [ ] Email validation prevents invalid format
- [ ] Can change password successfully
- [ ] Confirm password validation works
- [ ] Can upload profile image successfully
- [ ] Image preview shows before upload
- [ ] Success message appears after update
- [ ] CIN field is read-only

### API Testing (with cURL)

**Get Profile:**
```bash
curl -X GET http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Update Profile:**
```bash
curl -X PUT http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "email": "newemail@example.com",
    "password": "NewPass123"
  }'
```

**Upload Image:**
```bash
curl -X POST http://localhost:6000/api/ref/editprofile/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Password Hashing**: Passwords are hashed with bcrypt (salt rounds: 10)
3. **Email Uniqueness**: Database enforces unique email constraint
4. **Input Validation**: All inputs validated server-side
5. **File Upload**: Cloudinary handles secure file storage
6. **CORS**: Configured to allow requests from frontend origin only

---

## Performance Optimization

1. **Image Resizing**: Cloudinary auto-resizes to 500x500px
2. **Face Detection**: Automatic face detection for better cropping
3. **Caching**: Frontend stores profile in component state
4. **Lazy Loading**: Images loaded on demand

---

## Troubleshooting

### Image Upload Not Working
- Check Cloudinary API credentials in `.env`
- Verify file format is supported
- Check file size (max 5MB)
- Check network connection

### Profile Update Failing
- Verify JWT token is valid
- Check email isn't already in use
- Verify password meets requirements
- Check server logs for detailed errors

### CORS Issues
- Update CORS origin in `ref-service/server.js` if frontend URL changes
- Ensure credentials flag is set correctly

---

## Future Enhancements

- [ ] Add phone number field
- [ ] Add date of birth field
- [ ] Add social media links
- [ ] Add profile bio/description
- [ ] Add two-factor authentication
- [ ] Add activity log
- [ ] Add data export feature
- [ ] Add profile privacy settings

---

## Support

For issues or questions:
1. Check error messages in browser console
2. Check server logs in terminal
3. Verify Cloudinary configuration
4. Check database connection
5. Review this guide for solutions
