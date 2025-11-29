# Edit Profile Architecture & Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EditProfile.jsx                                                 │
│  ├─ Load Profile (GET)                                          │
│  ├─ Update Profile (PUT)                                        │
│  ├─ Upload Image (POST)                                         │
│  └─ Form Validation                                             │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP Requests
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
      GET              PUT              POST
       │                │                │
┌──────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Optional)                         │
│              Routes /ref/api/ref/ requests                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────────────────────────────────────────────┐
│                   REF-SERVICE (Node.js)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Routes (editprofileRoute.js)                                    │
│  ├─ GET  /editprofile           → getProfile()                 │
│  ├─ PUT  /editprofile           → editProfile()                │
│  └─ POST /editprofile/upload-image → uploadProfileImage()      │
│                                                                   │
│  Middleware (checkAuth.js)                                       │
│  └─ Validates JWT Token                                         │
│                                                                   │
│  Controller (profileController.js)                               │
│  ├─ Validation Logic                                            │
│  ├─ Database Updates                                            │
│  └─ Error Handling                                              │
│                                                                   │
│  File Upload (multerConfig.js)                                   │
│  └─ Cloudinary Integration                                      │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    Database         Cloudinary           Response
                      Storage
        │                  │                  │
┌──────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  users table                                                     │
│  ├─ id (PK)                                                     │
│  ├─ cin (unique)                                                │
│  ├─ name                                                        │
│  ├─ email (unique)                                              │
│  ├─ password (hashed)                                           │
│  ├─ imgURL (Cloudinary URL)                                     │
│  ├─ created_at                                                  │
│  └─ updated_at                                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Component Flow Diagram

```
┌──────────────────┐
│ Component Mount  │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │ useEffect Hook                  │
    │ ├─ Check if user is auth        │
    │ ├─ Fetch profile via API        │
    │ └─ Set state with data          │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Form Renders with:              │
    │ ├─ Avatar/Image Display         │
    │ ├─ Upload Button                │
    │ ├─ Name Field                   │
    │ ├─ Email Field                  │
    │ ├─ CIN Field (read-only)        │
    │ ├─ Password Field               │
    │ ├─ Confirm Password Field       │
    │ └─ Submit Button                │
    └────────┬────────────────────────┘
             │
    ┌────────┴──────────────────────────┐
    │                                   │
    ▼                                   ▼
┌──────────────────┐        ┌──────────────────┐
│ User Interactions│        │ Form Validation  │
├──────────────────┤        ├──────────────────┤
│ 1. Upload Image  │        │ Real-time check: │
│    ├─ Select file│        │ ├─ Email format  │
│    ├─ Preview    │        │ ├─ Name length   │
│    ├─ Upload     │        │ ├─ Password      │
│    └─ Success    │        │ │  strength      │
│                  │        │ └─ Password      │
│ 2. Edit Name     │        │    match         │
│    ├─ Focus      │        │                  │
│    ├─ Clear      │        │ Show errors ↔   │
│    └─ Type       │        │ Show hints       │
│                  │        │                  │
│ 3. Edit Email    │        │                  │
│    ├─ Focus      │        │                  │
│    ├─ Clear      │        │                  │
│    └─ Type       │        │                  │
│                  │        │                  │
│ 4. Change Pwd    │        │                  │
│    ├─ Enter pwd  │        │                  │
│    ├─ Confirm    │        │                  │
│    └─ Match      │        │                  │
│                  │        │                  │
│ 5. Click Save    │        │                  │
│    ├─ Validate   │        │                  │
│    ├─ Send API   │        │                  │
│    └─ Show msg   │        │                  │
└──────────────────┘        └──────────────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │ Form Submission        │
        ├────────────────────────┤
        │ 1. Validate all fields │
        │ 2. Show loading state  │
        │ 3. Send PUT request    │
        │ 4. Handle response     │
        └────────┬───────────────┘
                 │
         ┌───────┴────────┐
         │                │
      Success          Error
         │                │
         ▼                ▼
    ✓ Success        ❌ Error
      Message          Message
         │                │
         └────────┬────────┘
                  │
                  ▼
        ┌────────────────────────┐
        │ Update Component State │
        │ Clear password fields  │
        │ Reload data if needed  │
        └────────────────────────┘
```

## Data Flow Diagram

```
User Types/Selects Data
        │
        ▼
┌──────────────────────────┐
│ Client-Side Validation   │
│ ├─ Email regex check     │
│ ├─ Name length check     │
│ ├─ Password strength     │
│ ├─ Confirm match         │
│ └─ Show feedback         │
└────────┬─────────────────┘
         │
    Valid? ◄─── Invalid ──► Show Error
         │                 (halt submission)
        Yes
         │
         ▼
┌──────────────────────────────────────────┐
│ Prepare Request Data                     │
│ {                                        │
│   name: "New Name",                      │
│   email: "new@email.com",                │
│   password: "NewPass123"  (if provided)  │
│ }                                        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Send HTTP Request                        │
│ PUT /ref/api/ref/editprofile             │
│ Headers: {                               │
│   Authorization: Bearer <token>,         │
│   Content-Type: application/json         │
│ }                                        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Authentication Middleware                │
│ ├─ Extract token                         │
│ ├─ Verify JWT signature                  │
│ ├─ Check expiration                      │
│ └─ Extract userId                        │
└────────┬─────────────────────────────────┘
         │
    Valid? ◄─── Invalid ──► Return 401
         │                 (Unauthorized)
        Yes
         │
         ▼
┌──────────────────────────────────────────┐
│ Server-Side Validation                   │
│ ├─ Email format validation               │
│ ├─ Email uniqueness check (DB)           │
│ ├─ Name length validation                │
│ ├─ Password strength validation          │
│ └─ Password match verification           │
└────────┬─────────────────────────────────┘
         │
    Valid? ◄─── Invalid ──► Return 400
         │                 (Bad Request)
        Yes
         │
         ▼
┌──────────────────────────────────────────┐
│ Process Updates (in transaction)         │
│ For each field:                          │
│ ├─ If password: hash with bcrypt        │
│ ├─ If other: prepare value               │
│ └─ Execute SQL UPDATE                    │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Database Update                          │
│ UPDATE users SET                         │
│   name = ?,                              │
│   email = ?,                             │
│   password = ? (hashed),                 │
│   updated_at = NOW()                     │
│ WHERE id = ?                             │
└────────┬─────────────────────────────────┘
         │
    Success? ◄─── Error ──► Return 500
         │                 (Server Error)
        Yes
         │
         ▼
┌──────────────────────────────────────────┐
│ Return Success Response (200)            │
│ {                                        │
│   success: true,                         │
│   message: "Updated successfully"        │
│ }                                        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Front-End: Handle Response               │
│ ├─ Check if success                      │
│ ├─ Clear password fields                 │
│ ├─ Show success notification             │
│ ├─ Reload profile data                   │
│ └─ Update component state                │
└──────────────────────────────────────────┘
```

## Image Upload Flow

```
User clicks "Change Picture"
        │
        ▼
File Input Dialog Opens
        │
        ▼
User Selects Image File
        │
        ▼
┌─────────────────────────────────┐
│ File Validation (Client-Side)   │
├─────────────────────────────────┤
│ ✓ File type is image?           │
│ ✓ File size < 5MB?              │
│ ✓ Supported format?             │
│   (JPG, PNG, GIF, WebP)         │
└────────┬────────────────────────┘
         │
    Valid? ◄─── Invalid ──► Show Error
         │                 "Invalid file"
        Yes
         │
         ▼
┌─────────────────────────────────┐
│ Show Image Preview              │
│ FileReader API reads file       │
│ Display in Avatar               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Create FormData                 │
│ const formData = new FormData() │
│ formData.append('image', file)  │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Send File to Backend                     │
│ POST /ref/api/ref/editprofile/upload-img │
│ Content-Type: multipart/form-data        │
│ Authorization: Bearer <token>            │
└────────┬─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Multer Receives File            │
│ ├─ Validates file type          │
│ ├─ Validates file size          │
│ └─ Prepares for upload          │
└────────┬────────────────────────┘
         │
    Valid? ◄─── Invalid ──► Return 400
         │
        Yes
         │
         ▼
┌──────────────────────────────────────────┐
│ Upload to Cloudinary                     │
│ ├─ Authenticate with API key            │
│ ├─ Resize to 500x500px                  │
│ ├─ Apply face detection                 │
│ ├─ Auto-crop                            │
│ └─ Store in cloud                       │
└────────┬─────────────────────────────────┘
         │
    Success? ◄─── Error ──► Return 500
         │
        Yes
         │
         ▼
┌──────────────────────────────────────────┐
│ Update Database                          │
│ UPDATE users SET imgURL = ? WHERE id = ? │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Return Cloudinary URL (200)              │
│ {                                        │
│   success: true,                         │
│   data: {                                │
│     imgURL: "https://cloudinary.url/.."  │
│   },                                     │
│   message: "Image uploaded successfully" │
│ }                                        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Front-End: Update Profile Picture       │
│ ├─ Update component state                │
│ ├─ Avatar displays new image             │
│ ├─ Show success message                  │
│ └─ Close upload dialog                   │
└──────────────────────────────────────────┘
```

## Password Change Validation

```
User enters password in field
        │
        ▼
┌─────────────────────────────────────────┐
│ Real-Time Validation                    │
├─────────────────────────────────────────┤
│ Check 1: Length >= 6?                   │
│   ├─ Show: ✓ Length OK    or ✗ Too Short
│   └─ Update error state                 │
│                                          │
│ Check 2: Has uppercase (A-Z)?           │
│   ├─ Show: ✓ Uppercase OK  or ✗ Missing │
│   └─ Update error state                 │
│                                          │
│ Check 3: Has lowercase (a-z)?           │
│   ├─ Show: ✓ Lowercase OK  or ✗ Missing │
│   └─ Update error state                 │
│                                          │
│ Check 4: Has number (0-9)?              │
│   ├─ Show: ✓ Number OK     or ✗ Missing │
│   └─ Update error state                 │
└─────────────────────────────────────────┘
         │
User enters confirm password
         │
         ▼
┌─────────────────────────────────────────┐
│ Confirm Password Validation             │
├─────────────────────────────────────────┤
│ Does confirm === password?              │
│   ├─ Yes: ✓ Passwords Match             │
│   └─ No:  ✗ Passwords Don't Match       │
└─────────────────────────────────────────┘
         │
Form submitted
         │
         ▼
┌─────────────────────────────────────────┐
│ Server-Side Password Validation         │
├─────────────────────────────────────────┤
│ 1. Check length >= 6                    │
│ 2. Check uppercase + lowercase + number │
│ 3. Hash with bcrypt (10 rounds)         │
│ 4. Store in database                    │
└─────────────────────────────────────────┘
```

## State Management

```
EditProfile Component State:

{
  loading: boolean,           // API calls in progress
  imageLoading: boolean,      // Image upload in progress
  profileData: {              // Current user profile
    id: number,
    name: string,
    email: string,
    cin: string,
    imgURL: string,
    role: string
  },
  imagePreview: string,       // Preview before upload
  passwordVisible: boolean,   // Show/hide password
  confirmPasswordVisible: boolean,
  form: FormInstance          // Ant Design form instance
}
```

## Error Handling Flow

```
Error Occurs
        │
        ▼
    ┌───────────────────────────┐
    │ Where Did It Occur?       │
    └───┬───────────┬────────┬──┘
        │           │        │
        ▼           ▼        ▼
    Client      Network   Server
        │           │        │
        ▼           ▼        ▼
    Show           Retry    Log &
    Toast         Dialog    Response
    Error                   Error
        │           │        │
        └───────────┴────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │ User Sees Error        │
        │ - Toast notification   │
        │ - Form validation msg  │
        │ - Inline error text    │
        └────────────────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │ User Can:              │
        │ - Fix input & retry    │
        │ - Click refresh        │
        │ - Go back/close        │
        └────────────────────────┘
```

---

**End of Architecture Diagrams**
