# EditProfile Component - Usage Examples

## Import and Basic Usage

### Simple Import
```jsx
import EditProfile from './Components/EditProfile';

export default function ProfilePage() {
  return (
    <div>
      <h1>User Profile</h1>
      <EditProfile />
    </div>
  );
}
```

### Inside a Layout/Dashboard
```jsx
import { Layout } from 'antd';
import NavBar from './Components/NavBar';
import SideBar from './Components/SideBar';
import EditProfile from './Components/EditProfile';

export default function Dashboard() {
  return (
    <Layout>
      <NavBar />
      <Layout>
        <SideBar />
        <Layout.Content style={{ padding: '24px' }}>
          <EditProfile />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
```

### Inside a Modal (Optional)
```jsx
import { Modal, Button } from 'antd';
import EditProfile from './Components/EditProfile';
import { useState } from 'react';

export default function ProfileModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
      <Modal
        title="Edit Your Profile"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={700}
      >
        <EditProfile />
      </Modal>
    </>
  );
}
```

## Component Features

### 1. Profile Picture Upload

**User Experience:**
```
1. User clicks "Change Picture" button
2. File explorer opens
3. User selects image (max 5MB)
4. Image preview shows immediately
5. Upload starts automatically
6. Success message appears
7. Profile picture updates
```

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### 2. Form Fields

#### Name Field
- **Type:** Text Input
- **Validation:** Required, 2-100 characters
- **Error Messages:**
  - "Please enter your full name"
  - "Name must be at least 2 characters"
  - "Name must not exceed 100 characters"

#### Email Field
- **Type:** Email Input
- **Validation:** Required, valid email format
- **Error Messages:**
  - "Please enter your email"
  - "Please enter a valid email address"

#### CIN Field
- **Type:** Text Input (Read-only)
- **Display:** Shows but cannot be edited
- **Reason:** Unique identifier

#### Password Field (Optional)
- **Type:** Password Input
- **Validation:** 
  - At least 6 characters
  - Must contain: uppercase, lowercase, number
- **Error Messages:**
  - "Password must be at least 6 characters"
  - "Password must contain uppercase, lowercase, and numbers"

#### Confirm Password Field
- **Type:** Password Input
- **Validation:** Must match password field
- **Error Message:**
  - "Passwords do not match"

### 3. API Integration

#### GET Profile Data
```javascript
// Automatically called on component mount
// Endpoint: GET /ref/api/ref/editprofile
// Response:
{
  "success": true,
  "data": {
    "id": 1,
    "cin": "12345678",
    "name": "John Doe",
    "email": "john@example.com",
    "imgURL": "https://cloudinary.url/image.jpg",
    "role": "student",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### PUT Update Profile
```javascript
// Called when user clicks "Save Changes"
// Endpoint: PUT /ref/api/ref/editprofile
// Request Body:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "NewPass123"  // Optional
}
// Response:
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### POST Upload Image
```javascript
// Called when user uploads image
// Endpoint: POST /ref/api/ref/editprofile/upload-image
// Request: FormData with "image" file
// Response:
{
  "success": true,
  "data": {
    "imgURL": "https://cloudinary.url/image.jpg"
  },
  "message": "Image uploaded successfully"
}
```

## Styling and Customization

### Component Styles
The component uses:
- Ant Design components (Card, Form, Input, Button, Upload, etc.)
- Custom CSS from `dashboard.scss`
- Inline responsive styles

### Customizing Colors

**Change primary color:**
Edit the theme in your Ant Design config or component styles.

**Currently uses:**
- Primary Blue: `#1890ff`
- Success Green: Auto from Ant Design
- Error Red: Auto from Ant Design
- Text Gray: `#999`

### Customizing Size

**Change card width:**
```jsx
// In EditProfile.jsx, line ~180
<div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
  {/* Change 600px to desired width */}
</div>
```

**Change avatar size:**
```jsx
// In EditProfile.jsx, line ~140
<Avatar size={100} ... />
{/* Change 100 to desired size */}
```

## Error Handling Examples

### Email Already Exists
```
Input: user.already.taken@example.com
Error: "Email already in use"
Solution: User must choose different email
```

### Weak Password
```
Input: password
Error: "Password must contain uppercase, lowercase, and numbers"
Solution: Password must be like "Password123"
```

### Password Mismatch
```
Input: 
  Password: "MyPass123"
  Confirm: "MyPass124"
Error: "Passwords do not match"
Solution: Re-enter matching passwords
```

### File Too Large
```
Input: image.jpg (6MB)
Error: "Image size must not exceed 5MB"
Solution: Compress image before upload
```

### Invalid Image Format
```
Input: document.pdf
Error: "Please upload an image file"
Solution: Use JPG, PNG, GIF, or WebP format
```

## Success Scenarios

### Successful Profile Update
```
✓ All validations pass
✓ Server responds with 200 status
✓ Success message: "Profile updated successfully"
✓ Form resets password fields
✓ Profile data reloads
```

### Successful Image Upload
```
✓ File is valid format and size
✓ Upload to Cloudinary succeeds
✓ Success message: "Image uploaded successfully"
✓ Avatar updates with new image
✓ Image stored in database
```

## Advanced Usage

### Integrating with State Management (Zustand)

```jsx
import { useAuthStore } from '../store/authStore';

// Inside EditProfile or parent component
const { user, setUser } = useAuthStore();

// After successful update
const handleSuccess = (updatedData) => {
  setUser(updatedData);
  // Update global auth store with new profile data
};
```

### Adding Notifications

```jsx
import { notification } from 'antd';

// Custom notification on success
const showNotification = () => {
  notification.success({
    message: 'Profile Updated',
    description: 'Your profile has been successfully updated!',
    duration: 4.5,
  });
};
```

### Conditional Rendering Based on User Role

```jsx
import { useAuthStore } from '../store/authStore';
import EditProfile from './EditProfile';

export default function ProfilePage() {
  const { user } = useAuthStore();

  // Only show EditProfile for certain roles
  if (!['student', 'teacher', 'admin'].includes(user?.role)) {
    return <div>Access Denied</div>;
  }

  return <EditProfile />;
}
```

## Component Flow Diagram

```
┌─────────────────────────┐
│   EditProfile Mount     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Load Profile Data      │ GET /ref/api/ref/editprofile
│  (useEffect)            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Populate Form Fields   │
│  Show Avatar/Image      │
└────────────┬────────────┘
             │
   ┌─────────┴──────────┬───────────────┐
   │                    │               │
   ▼                    ▼               ▼
Update Text    Upload Image      Change Password
   │                │                   │
   └─────────┬──────┴───────────────────┘
             │
             ▼
   ┌─────────────────────────┐
   │ User Clicks Save        │
   └────────────┬────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │ Validate All Fields     │
   └────────────┬────────────┘
                │
       ┌────────┴────────┐
       │                 │
    Valid           Invalid
       │                 │
       ▼                 ▼
   Update          Show Error
                    Message
       │
       ▼
PUT /ref/api/ref/editprofile
       │
   ┌───┴────┐
   │        │
Success  Error
   │        │
   ▼        ▼
  ✓     Show Error
Update   Message
Data
```

## Keyboard Shortcuts (Future Enhancement)

Future versions could include:
- `Ctrl/Cmd + S` - Save profile
- `Ctrl/Cmd + Z` - Reset form
- `Tab` - Navigate between fields
- `Enter` - Submit form

## Accessibility Features

The component includes:
- ✓ Semantic HTML structure
- ✓ Form labels for all inputs
- ✓ Error messages linked to inputs
- ✓ Proper color contrast
- ✓ Keyboard navigation support
- ✓ ARIA labels (can be enhanced)

## Performance Considerations

- Component uses React hooks efficiently
- Form validation is client-side first
- Image upload uses Cloudinary (handles optimization)
- Profile data cached in component state
- Refresh button for manual data reload

## Browser Compatibility

✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

Usually used with:
- `NavBar.jsx` - Navigation header
- `SideBar.jsx` - Navigation sidebar
- Authentication components
- Dashboard layout

## Next Steps

After integration:
1. Test all functionality
2. Customize styling if needed
3. Add to your main navigation
4. Update user documentation
5. Monitor error logs
6. Gather user feedback

---

**Questions?** Check `EDITPROFILE_SETUP_GUIDE.md` for detailed documentation.
