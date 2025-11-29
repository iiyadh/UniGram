# RBAC Quick Reference Guide

## 🔐 How Authorization Works

### Token Flow
```
User Login → JWT Created with {userId, userRole, userDepartmentId}
                ↓
         Token Stored in Frontend
                ↓
      Attached to API Requests
                ↓
    Backend Verifies & Extracts Role
                ↓
     Route/Controller Checks Permissions
                ↓
    200 OK (Allowed) or 403 Forbidden
```

---

## 👥 Role-Based Dashboard Access

| Role | Dashboard Route | Access |
|------|-----------------|--------|
| **Admin** | `/dashboard/*` | All modules |
| **Chef** | `/chef-dashboard/*` | Own department only |
| **Teacher** | `/teacher-dashboard/*` | Own schedule + create excuses |
| **Student** | `/student-dashboard/*` | Own cards + groupe schedule |

---

## 🚀 New Features

### Teacher Excused Absence Modal
**Location:** Teacher Dashboard Home Page
**How to Use:**
1. Click "Create Excused Absence" button
2. Select date (future only)
3. Enter reason (10-500 characters)
4. Click Submit

**API Endpoint:**
```
POST /schedule/api/schedule/excused-absence
{
  "teacher_id": 123,
  "reason": "Doctor appointment",
  "date": "2025-11-26"
}
```

---

## 🔒 Authorization Validations

### Chef (Department Head)
```javascript
// ✓ Allowed: Viewing own department
GET /specialties/1 (user.department_id === 1)

// ✗ Blocked: Viewing other department
GET /specialties/2 (403 Forbidden)
```

### Teacher
```javascript
// ✓ Allowed: Viewing own schedule
GET /schedule-entries-teacher/1 (user.id === 1)

// ✗ Blocked: Viewing other teacher's schedule
GET /schedule-entries-teacher/2 (403 Forbidden)

// ✓ Allowed: Creating excuse for self
POST /excused-absence { teacher_id: 1, ... } (user.id === 1)

// ✗ Blocked: Creating excuse for others
POST /excused-absence { teacher_id: 2, ... } (403 Forbidden)
```

### Student
```javascript
// ✓ Allowed: Viewing own absence cards
GET /absences-student/1 (user.id === 1)

// ✗ Blocked: Viewing other student's cards
GET /absences-student/2 (403 Forbidden)
```

---

## 📋 HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 500 | Server Error | Backend error |

---

## 🛠️ Middleware Stack

```
Incoming Request
    ↓
[1] authenticateToken - Verify JWT, extract userId, userRole, userDepartmentId
    ↓
[2] authorizeRole (optional) - Check if role allowed for route
    ↓
[3] Controller - Business logic with additional checks
    ↓
Response
```

---

## 💾 Key Database Fields

**Users Table:**
- `id` - Primary key
- `role` - 'admin', 'chef', 'teacher', 'student'
- `department_id` - For chef role (nullable)

**Teachers Table:**
- `uid` - Link to users table

**ExcusedAbsences Table:**
- `teacher_id` - Who created it
- `reason` - Why they're absent
- `date` - When the absence is

---

## 📝 Login Response Example

```json
{
  "message": "User logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "teacher",
  "id": 123,
  "department_id": null
}
```

**Token Decoded Contains:**
```json
{
  "userId": 123,
  "userRole": "teacher",
  "userDepartmentId": null,
  "iat": 1700908800,
  "exp": 1700909700
}
```

---

## 🔄 Frontend State (authStore)

```javascript
const authStore = {
  token: "jwt_token_string",
  role: "teacher",
  id: 123,
  department_id: null,
  
  login: async (credentials) => {...},
  logout: async () => {...},
  isAuthenticated: () => !!token
}
```

---

## 🎯 Common Development Tasks

### Verify User Role in Component
```javascript
import { useAuthStore } from '../store/authStore';

const MyComponent = () => {
  const { role, id, department_id } = useAuthStore();
  
  if (role === 'teacher') {
    // Show teacher-specific UI
  }
};
```

### Make Authorized API Call
```javascript
import api from '../api/interceptor';

// Token automatically included in headers
const response = await api.get('/schedule/api/schedule/schedule-entries-teacher/123');
```

### Check Permission Before Action
```javascript
const { id } = useAuthStore();

if (teacherId !== id) {
  message.error('You can only modify your own schedule');
  return;
}
```

### Create Protected Route
```jsx
<RoleProtection allowedRoles={['teacher', 'admin']}>
  <TeacherComponent />
</RoleProtection>
```

---

## 🐛 Debugging Tips

### Check Token Contents
```javascript
// In browser console
const token = localStorage.getItem('token'); // or wherever it's stored
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log(decoded);
// Look for: userId, userRole, userDepartmentId
```

### Test API with curl
```bash
# Get token first
TOKEN=$(curl -X POST http://localhost:4000/auth/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cin":"1234","password":"pass"}' | jq -r '.token')

# Use token in request
curl http://localhost:3001/ref/api/coreacademy/specialties/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Check Middleware Order
1. `authenticateToken` must run first
2. `authorizeRole` (if used) runs next
3. Controller logic last

### Monitor Authorization Failures
```javascript
// In backend controller
if (userRole === 'chef' && depId !== userDepartmentId) {
  console.log(`Unauthorized: Chef ${userId} tried to access dept ${depId}`);
  return res.status(403).json({...});
}
```

---

## ✅ Testing Checklist

- [ ] Admin can access all dashboard routes
- [ ] Chef can only access own department specialties
- [ ] Chef gets 403 when accessing other departments
- [ ] Teacher can view only own schedule
- [ ] Teacher can create excused absence
- [ ] Teacher cannot create excuse for other teachers
- [ ] Student can view own absence cards
- [ ] Student cannot view other students' data
- [ ] Unauthenticated requests return 401
- [ ] Token missing role info returns 403
- [ ] Routes redirect to login if not authenticated
- [ ] Logout clears auth state properly

---

## 📚 Related Files

| Purpose | File |
|---------|------|
| Full RBAC Documentation | `/RBAC_IMPLEMENTATION.md` |
| Implementation Summary | `/IMPLEMENTATION_SUMMARY.md` |
| Auth Middleware | `auth-service/middlewares/auth.js` |
| Auth Controller | `auth-service/controllers/authController.js` |
| Auth Store | `client/src/store/authStore.js` |
| Role Protection | `client/src/Protection/RoleProtection.jsx` |
| Excuse Modal | `client/src/Components/Modal/ExcusedAbsenceModal.jsx` |
| Teacher Dashboard | `client/src/Pages/Dashboard/TeacherHome.jsx` |
| Chef Dashboard | `client/src/Pages/Dashboard/ChefHome.jsx` |
| Student Dashboard | `client/src/Pages/Dashboard/StudentHome.jsx` |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| 403 on dept access | Check `department_id` in database matches request |
| Cannot create excuse | Verify teacher_id matches logged-in user |
| Routes not showing | Check role is set in authStore after login |
| Token invalid | User needs to logout and login again |
| Permission denied | Verify user role and data ownership |

---

**Last Updated:** November 25, 2025
**Version:** 1.0
