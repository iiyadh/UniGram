# Edit Profile - Code Snippets & Quick Copy-Paste

## 📋 Environment Configuration

### .env for ref-service
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unicord_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

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

### .env for client
```env
VITE_BASE_URL=http://localhost:3000
```

---

## 🔧 NPM Installation Commands

```bash
# In ref-service directory
cd ref-service
npm install cloudinary multer-storage-cloudinary
npm start

# In client directory
cd client
npm install
npm run dev
```

---

## 💻 Component Import

### Basic Import
```jsx
import EditProfile from './Components/EditProfile';

export default function ProfilePage() {
  return <EditProfile />;
}
```

### In a Route
```jsx
import { Routes, Route } from 'react-router-dom';
import EditProfile from './Components/EditProfile';

<Routes>
  <Route path="/profile/edit" element={<EditProfile />} />
</Routes>
```

### In a Layout with NavBar and SideBar
```jsx
import { Layout } from 'antd';
import NavBar from './Components/NavBar';
import SideBar from './Components/SideBar';
import EditProfile from './Components/EditProfile';

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
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

### In a Modal
```jsx
import { Modal, Button } from 'antd';
import { useState } from 'react';
import EditProfile from './Components/EditProfile';

export default function ProfileModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit Profile
      </Button>
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

---

## 🧪 API Testing Commands

### Get Profile with cURL
```bash
curl -X GET http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Profile with cURL
```bash
curl -X PUT http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "NewPass123"
  }'
```

### Upload Image with cURL
```bash
curl -X POST http://localhost:6000/api/ref/editprofile/upload-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Get Profile with JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:6000/api/ref/editprofile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

### Update Profile with JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:6000/api/ref/editprofile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'NewPass123'
  })
});
const data = await response.json();
console.log(data);
```

### Upload Image with JavaScript/Fetch
```javascript
const file = event.target.files[0];
const formData = new FormData();
formData.append('image', file);

const response = await fetch('http://localhost:6000/api/ref/editprofile/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
const data = await response.json();
console.log(data);
```

---

## 🗄️ Database Query Examples

### Check user profile
```sql
SELECT id, cin, name, email, imgURL, role, created_at, updated_at 
FROM users 
WHERE id = 1;
```

### Update profile manually
```sql
UPDATE users 
SET name = 'New Name', email = 'newemail@example.com', updated_at = NOW()
WHERE id = 1;
```

### Check if email exists
```sql
SELECT COUNT(*) FROM users WHERE email = 'email@example.com';
```

### Get all users (for testing)
```sql
SELECT id, name, email, imgURL FROM users LIMIT 10;
```

---

## 📝 Validation Patterns

### Email Regex Pattern
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (emailRegex.test(email)) {
  console.log('Valid email');
}
```

### Password Strength Regex
```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
if (passwordRegex.test(password)) {
  console.log('Strong password');
}
```

### Password Validation Function
```javascript
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## 🎨 Styling Customization

### Change Card Width
In EditProfile.jsx, find this line:
```jsx
<div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
```

Change `600px` to desired width:
```jsx
<div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
```

### Change Avatar Size
In EditProfile.jsx, find:
```jsx
<Avatar size={100} src={imagePreview} />
```

Change `100` to desired size:
```jsx
<Avatar size={150} src={imagePreview} />
```

### Change Form Label Width
In Ant Design Form component:
```jsx
<Form layout="vertical" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
  {/* form items */}
</Form>
```

### Add Custom CSS Class
```jsx
<div className="custom-edit-profile">
  <EditProfile />
</div>
```

Then in your CSS:
```css
.custom-edit-profile {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.custom-edit-profile .profile-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 🔐 Security Headers

### Express Middleware for Security
```javascript
const express = require('express');
const app = express();

// CORS with credentials
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Rate limiting example
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## 🐛 Error Handling Examples

### Try-Catch with Logging
```javascript
try {
  const response = await api.put('/ref/api/ref/editprofile', updateData);
  if (response.data.success) {
    message.success('Profile updated successfully');
  }
} catch (error) {
  console.error('Error updating profile:', error);
  
  // Handle specific error types
  if (error.response?.status === 400) {
    message.error(error.response.data.message);
  } else if (error.response?.status === 401) {
    message.error('Session expired. Please login again.');
  } else if (error.response?.status === 500) {
    message.error('Server error. Please try again later.');
  } else {
    message.error('An unexpected error occurred');
  }
}
```

### Custom Error Handler Middleware
```javascript
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // Validation errors
  if (error.status === 400) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  // Authentication errors
  if (error.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  // Server errors
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

---

## 📦 Package.json Dependencies

### ref-service dependencies to add
```json
"cloudinary": "^2.0.0",
"multer-storage-cloudinary": "^4.0.0",
"express": "^5.1.0",
"bcrypt": "^6.0.0",
"pg": "^8.16.3",
"dotenv": "^17.2.3"
```

### client dependencies (already included)
```json
"antd": "^5.27.6",
"axios": "^1.12.2",
"react": "^18.3.1",
"react-router-dom": "^7.9.4"
```

---

## 🔄 Common Workflows

### Complete Login to Edit Profile Flow
```javascript
// 1. Login
const loginResponse = await api.post('/auth/api/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
const token = loginResponse.data.token;
localStorage.setItem('token', token);

// 2. Navigate to EditProfile component (done by router)

// 3. Component mounts and loads profile
// Done automatically in useEffect

// 4. User updates profile (triggered by form submission)
// Done by handleFinish function in component

// 5. Component shows success message
// Done automatically via notification
```

### Testing Complete Flow with cURL
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:5000/auth/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')

# 2. Get profile
curl -X GET http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer $TOKEN"

# 3. Update profile
curl -X PUT http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","email":"newemail@example.com"}'

# 4. Get profile again to verify
curl -X GET http://localhost:6000/api/ref/editprofile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Deployment Checklist Commands

```bash
# Build frontend
cd client
npm run build

# Test backend
cd ref-service
npm test  # if tests exist

# Check for security vulnerabilities
npm audit
npm audit fix

# Clean install for production
rm -rf node_modules package-lock.json
npm install --production

# Start production
NODE_ENV=production npm start
```

---

## 📊 Database Backup Commands

```sql
-- Backup users table
COPY users TO '/path/to/users_backup.csv' WITH CSV;

-- Restore users table
COPY users FROM '/path/to/users_backup.csv' WITH CSV;

-- Export specific user
COPY (SELECT * FROM users WHERE id = 1) TO '/path/to/user_1.csv';

-- Show all columns in users table
\d users

-- Show constraints on users table
\d+ users
```

---

## 🧹 Cleanup Commands

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Remove logs
rm -rf logs/*.log

# Remove temporary files
find . -name '.DS_Store' -delete
find . -name '*.tmp' -delete

# Git cleanup
git clean -fd
git reset --hard
```

---

## 📈 Performance Testing

```javascript
// Performance monitoring
console.time('API Call');
const response = await api.get('/ref/api/ref/editprofile');
console.timeEnd('API Call');

// Memory usage
console.log('Memory usage:', process.memoryUsage());

// Response time tracking
const startTime = Date.now();
// ... do something ...
const endTime = Date.now();
console.log(`Time taken: ${endTime - startTime}ms`);
```

---

## 🔗 Useful Links

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Ant Design Components](https://ant.design/components/overview/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)
- [Multer npm](https://www.npmjs.com/package/multer)

---

**End of Code Snippets**

Copy-paste these as needed for quick setup and testing!
