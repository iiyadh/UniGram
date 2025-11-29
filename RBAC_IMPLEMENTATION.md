# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the comprehensive role-based access control (RBAC) system implemented across the Unicord application, including backend authorization middleware and frontend route protection.

## Roles and Permissions

### 1. **Admin**
**Permissions:**
- Full access to all system modules and data
- Can view and manage:
  - Departments
  - Specialties
  - Levels
  - Groups
  - Classrooms
  - Subjects
  - Students
  - Teachers
  - All schedules (groups, classrooms, teachers)
  - Attendance records

**Routes:**
- `/dashboard/*` - Full admin dashboard access

---

### 2. **Chef (Department Head)**
**Permissions:**
- Access limited to their own department only
- Can view specialties within their department
- Cannot access data from other departments

**Data Restrictions:**
- Specialty access is validated at the controller level
- The system checks `userDepartmentId` against requested `dep_id`
- Unauthorized access returns HTTP 403

**Routes:**
- `/chef-dashboard/*` - Department-specific dashboard

**Example API Call:**
```javascript
GET /ref/api/coreacademy/specialties/{dep_id}
// If user's department_id !== dep_id, returns 403
```

---

### 3. **Teacher**
**Permissions:**
- View only their personal schedule
- Create excused absence records
- Cannot access other teachers' schedules or data

**Data Restrictions:**
- Schedule access validated via `teacher_id` parameter
- Teachers can only create excuses for themselves
- Cannot view other teachers' excused absences

**Routes:**
- `/teacher-dashboard/*` - Teacher-specific dashboard
- `/teacher-dashboard/schedule/{id}` - Personal schedule view

**New Feature - Excused Absence Modal:**
- Teachers can create excused absence records through a modal popup
- Modal requires:
  - Date (future dates only)
  - Reason (10-500 characters)
- Available on teacher home page with dedicated button

**Example API Calls:**
```javascript
// Get teacher's schedule (only own schedule)
GET /schedule/api/schedule/schedule-entries-teacher/{teacher_id}
// teacher_id must match authenticated user's ID

// Create excused absence
POST /schedule/api/schedule/excused-absence
{
  "teacher_id": userId,
  "schedule_entry_id": null,
  "reason": "reason for absence",
  "date": "2025-11-25"
}
```

---

### 4. **Student**
**Permissions:**
- View their absence cards by subject
- View their group schedule only
- Cannot access schedules from other groups
- Cannot access other students' data

**Data Restrictions:**
- Access to group schedule requires groupe_id validation
- Absence records filtered by student_id
- Cannot view other students' information

**Routes:**
- `/student-dashboard/*` - Student-specific dashboard
- `/student-dashboard/absence-cards/{id}` - Personal absence cards
- `/student-dashboard/schedule` - Personal groupe schedule

---

## Backend Implementation

### Authentication Middleware (`auth-service/middlewares/auth.js`)
```javascript
// Enhanced token verification
jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    req.userId = payload.userId;
    req.userRole = payload.userRole;
    req.userDepartmentId = payload.userDepartmentId;
});
```

**Added Methods:**
- `authenticateToken()` - Verifies JWT and extracts user info including role and department
- `authorizeRole(allowedRoles)` - Middleware to enforce role-based access

### Authorization Middleware (`ref-service/middlewares/checkAuth.js`)
Enhanced to validate role-based access:
```javascript
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
```

### Token Structure
Tokens now include role and department information:
```javascript
{
  userId: 123,
  userRole: 'chef' | 'teacher' | 'student' | 'admin',
  userDepartmentId: 456,
  iat: 1234567890,
  exp: 1234567890
}
```

### Controller-Level Authorization

**Specialty Controller** (`ref-service/controllers/specialtyController.js`)
```javascript
const getAllSpecialities = async (req, res) => {
    const { dep_id } = req.params;
    const userRole = req.userRole;
    const userDepartmentId = req.userDepartmentId;
    
    // Chef can only access their department
    if (userRole === 'chef' && parseInt(dep_id) !== parseInt(userDepartmentId)) {
        return res.status(403).json({
            success: false,
            message: "You can only access specialties from your own department"
        });
    }
    // ... rest of logic
};
```

**Schedule Entry Controller** (`schedule-service/controllers/scheduleentryController.js`)
```javascript
const getAllScheduleEntriesForTeacher = async (req, res) => {
    const { teacher_id } = req.params;
    const userRole = req.userRole;
    const userId = req.userId;

    // Teacher can only access their own schedule
    if (userRole === 'teacher' && parseInt(teacher_id) !== parseInt(userId)) {
        return res.status(403).json({
            success: false,
            error: 'You can only view your own schedule'
        });
    }
    // ... rest of logic
};
```

**Excused Absence Controller** (`schedule-service/controllers/excusedAbsenceController.js`)
```javascript
const createExcusedAbsence = async (req, res) => {
    const { teacher_id, reason, date } = req.body;
    const userRole = req.userRole;
    const userId = req.userId;

    // Teacher can only create excuses for themselves
    if (userRole === 'teacher' && parseInt(teacher_id) !== parseInt(userId)) {
        return res.status(403).json({
            success: false,
            error: 'You can only create excused absences for yourself'
        });
    }
    // ... rest of logic
};
```

---

## Frontend Implementation

### Auth Store (`client/src/store/authStore.js`)
Enhanced to include department information:
```javascript
login: async (data) => {
    const res = await api.post('/auth/api/auth/login', data);
    set({ token: res.data.token });
    set({ role: res.data.role });
    set({ id: res.data.id });
    set({ department_id: res.data.department_id });
}
```

### Role Protection Component (`client/src/Protection/RoleProtection.jsx`)
```javascript
const RoleProtection = ({ children, allowedRoles }) => {
    const { role, isAuthenticated } = useAuthStore();
    
    useEffect(() => {
        if (!isAuthenticated() || !allowedRoles.includes(role)) {
            navigate('/');
        }
    }, [role]);
    
    return children;
};
```

### Dynamic Routing (`client/src/main.jsx`)
Routes are now generated dynamically based on user role:
```javascript
const getRouterConfig = () => {
    const { role, id, department_id } = useAuthStore.getState();
    
    if (role === 'admin') {
        // Admin routes
    } else if (role === 'chef') {
        // Chef routes
    } else if (role === 'teacher') {
        // Teacher routes
    } else if (role === 'student') {
        // Student routes
    }
};
```

### New Components

#### TeacherHome (`client/src/Pages/Dashboard/TeacherHome.jsx`)
- Dashboard home page for teachers
- Quick action button to create excused absence
- Displays list of excused absences

#### ExcusedAbsenceModal (`client/src/Components/Modal/ExcusedAbsenceModal.jsx`)
- Modal for creating excused absence records
- Form validation:
  - Date: Future dates only, required
  - Reason: 10-500 characters, required
- Handles API communication
- Shows success/error messages

#### ChefHome (`client/src/Pages/Dashboard/ChefHome.jsx`)
- Department head dashboard
- Displays specialties for their department
- Quick actions for managing specialties

#### StudentHome (`client/src/Pages/Dashboard/StudentHome.jsx`)
- Student dashboard home page
- Tabs for absence cards and schedule
- Student-specific information display

---

## API Endpoints with Authorization

### Authenticated Endpoints (All roles)
All backend API calls require a valid JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

### Role-Specific Endpoints

**Admin Only:**
- `GET /ref/api/coreacademy/departments` - View all departments
- `GET /ref/api/coreacademy/students` - View all students
- `GET /ref/api/coreacademy/teachers` - View all teachers

**Chef Only (Department Restricted):**
- `GET /ref/api/coreacademy/specialties/{dep_id}` - Must be user's department
- `GET /ref/api/coreacademy/levels/{spec_id}` - Only from own department's specialties
- `GET /ref/api/coreacademy/subjects/{level_id}` - Only from own department's levels

**Teacher Only (Personal Only):**
- `GET /schedule/api/schedule/schedule-entries-teacher/{teacher_id}` - Must be own ID
- `POST /schedule/api/schedule/excused-absence` - Can only create for self
- `GET /schedule/api/schedule/excused-absence/{teacher_id}` - Must be own ID

**Student Only (Personal Only):**
- `GET /schedule/api/schedule/schedule-entries-groupe/{groupe_id}` - If student in groupe
- `GET /schedule/api/schedule/absences-student/{student_id}` - Must be own ID

---

## New Feature: Excused Absence for Teachers

### Overview
Teachers now have a dedicated feature to create excused absence records indicating they will not attend a class.

### User Interface
1. **Accessible From:** Teacher Dashboard Home Page
2. **Button:** "Create Excused Absence" button in header
3. **Trigger:** Click button to open modal

### Modal Form
**Fields:**
- **Date:** DatePicker (future dates only)
- **Reason:** TextArea (10-500 characters)

**Submit:** Creates record in database

### Backend Endpoint
```
POST /schedule/api/schedule/excused-absence
Content-Type: application/json
Authorization: Bearer {token}

{
  "teacher_id": 123,
  "schedule_entry_id": null,
  "reason": "Medical appointment",
  "date": "2025-11-26"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "teacher_id": 123,
    "schedule_entry_id": null,
    "reason": "Medical appointment",
    "date": "2025-11-26",
    "created_at": "2025-11-25T10:30:00Z"
  }
}
```

---

## Security Considerations

1. **Token Validation:** All protected routes verify JWT tokens
2. **Role-Based Access:** Each endpoint validates user role
3. **Department-Level Access:** Chefs can only access their department
4. **User-Level Access:** Teachers/Students can only access personal data
5. **HTTP Status Codes:**
   - `401` - Unauthorized (no valid token)
   - `403` - Forbidden (insufficient permissions)
   - `400` - Bad request (invalid parameters)

---

## Database Requirements

### Users Table
Must include:
- `id` - Primary key
- `role` - 'admin', 'chef', 'teacher', 'student'
- `department_id` - For chef role (foreign key)

### Teachers Table
Should include:
- `id` - Primary key
- `uid` - User ID (foreign key)
- `department_id` - For department head association (optional)

### ExcusedAbsences Table
Should include:
- `id` - Primary key
- `teacher_id` - Foreign key to teachers
- `schedule_entry_id` - Foreign key to schedule entries (nullable)
- `reason` - Text field for reason
- `date` - Date of absence

---

## Testing the Implementation

### 1. Test Admin Access
```bash
# Login as admin
POST /auth/api/auth/login
{
  "cin": "admin_cin",
  "password": "password"
}

# Should have access to all routes
GET /dashboard/* (all routes accessible)
```

### 2. Test Chef Access
```bash
# Login as chef for department 1
POST /auth/api/auth/login
{
  "cin": "chef_cin",
  "password": "password"
}

# Should only see department 1 specialties
GET /ref/api/coreacademy/specialties/1 ✓ (200)
GET /ref/api/coreacademy/specialties/2 ✗ (403)
```

### 3. Test Teacher Excused Absence
```bash
# Login as teacher
POST /auth/api/auth/login
{ "cin": "teacher_cin", "password": "password" }

# Create excused absence
POST /schedule/api/schedule/excused-absence
{
  "teacher_id": 1,
  "reason": "Medical appointment",
  "date": "2025-11-26"
}
# Should return 201 with created record

# Try to create for another teacher
POST /schedule/api/schedule/excused-absence
{
  "teacher_id": 2,
  "reason": "Same reason",
  "date": "2025-11-26"
}
# Should return 403 Forbidden
```

### 4. Test Student Access
```bash
# Login as student
POST /auth/api/auth/login
{ "cin": "student_cin", "password": "password" }

# View personal schedule
GET /schedule/api/schedule/schedule-entries-groupe/1 ✓
# View personal absence cards
GET /schedule/api/schedule/absences-student/1 ✓
```

---

## Future Enhancements

1. **Student-Groupe Mapping:** Add validation to ensure students can only access their assigned groupe's schedule
2. **Audit Logging:** Log all authorization failures and data access
3. **Fine-Grained Permissions:** Implement module-level permissions for more control
4. **Refresh Token Rotation:** Implement refresh token rotation for enhanced security
5. **API Key Support:** Add API key authentication for service-to-service communication
6. **Rate Limiting:** Implement rate limiting per role/user

---

## Conclusion

The RBAC implementation provides a robust, scalable security model that:
- Ensures proper access control at multiple levels
- Protects sensitive data by role
- Provides clear separation of concerns
- Enables easy future expansion
- Maintains security best practices
