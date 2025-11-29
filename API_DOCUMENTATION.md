# RBAC API Documentation

## Authentication Endpoints

### Login
**Endpoint:** `POST /auth/api/auth/login`

**Request:**
```json
{
  "cin": "user_cin",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "message": "User logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "teacher",
  "id": 123,
  "department_id": null
}
```

**Token Payload:**
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

### Refresh Token
**Endpoint:** `POST /auth/api/auth/refresh`

**Headers:** 
- `Cookie: token={refresh_token}`

**Response (200 OK):**
```json
{
  "token": "new_access_token_jwt"
}
```

---

### Logout
**Endpoint:** `POST /auth/api/auth/logout`

**Headers:** 
- `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "message": "User logged out"
}
```

---

## Admin Endpoints

### Get All Departments
**Endpoint:** `GET /ref/api/coreacademy/departments`

**Headers:** 
- `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Computer Science",
      "created_at": "2025-01-10T10:30:00Z"
    }
  ]
}
```

**Authorization:** Admin only

---

### Get All Students
**Endpoint:** `GET /ref/api/coreacademy/students`

**Headers:** 
- `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1000,
      "name": "Ahmed Ali",
      "email": "ahmed@example.com",
      "groupe_id": 5
    }
  ]
}
```

**Authorization:** Admin only

---

### Get All Teachers
**Endpoint:** `GET /ref/api/coreacademy/teachers`

**Headers:** 
- `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "teacher_id": 1,
      "name": "Dr. Hassan",
      "email": "hassan@example.com",
      "cin": "12345678"
    }
  ]
}
```

**Authorization:** Admin only

---

## Chef Endpoints

### Get Specialties (Own Department Only)
**Endpoint:** `GET /ref/api/coreacademy/specialties/{dep_id}`

**Headers:** 
- `Authorization: Bearer {token}`

**URL Parameters:**
- `dep_id` - Department ID (must match user's department_id)

**Response (200 OK - Own Department):**
```json
{
  "success": true,
  "message": "Specialities retrieved successfully",
  "data": [
    {
      "id": 1,
      "code_speciality": "CS-001",
      "name_speciality": "Software Engineering",
      "departement_id": 1
    }
  ]
}
```

**Response (403 Forbidden - Other Department):**
```json
{
  "success": false,
  "message": "You can only access specialties from your own department"
}
```

**Authorization:** Chef/Admin
**Restriction:** Chef can only access own department (id === user.department_id)

**Example:**
```bash
# Chef with department_id=1
curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/ref/api/coreacademy/specialties/1
# ✓ 200 OK

curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/ref/api/coreacademy/specialties/2
# ✗ 403 Forbidden
```

---

## Teacher Endpoints

### Get Personal Schedule
**Endpoint:** `GET /schedule/api/schedule/schedule-entries-teacher/{teacher_id}`

**Headers:** 
- `Authorization: Bearer {token}`

**URL Parameters:**
- `teacher_id` - Teacher ID (must match authenticated user's id)

**Response (200 OK - Own Schedule):**
```json
{
  "success": true,
  "message": "Schedule entries for teacher retrieved successfully",
  "data": [
    {
      "id": 1,
      "subject_id": 5,
      "teacher_id": 123,
      "classroom_id": 2,
      "groupe_id": 3,
      "day": "Monday",
      "time_slot": "09:00-10:30"
    }
  ]
}
```

**Response (403 Forbidden - Other Teacher):**
```json
{
  "success": false,
  "error": "You can only view your own schedule"
}
```

**Authorization:** Teacher/Admin
**Restriction:** Teacher can only access own schedule (teacher_id === user.id)

**Example:**
```bash
# Teacher with id=123
curl -H "Authorization: Bearer {token}" \
  http://localhost:3003/schedule/api/schedule/schedule-entries-teacher/123
# ✓ 200 OK

curl -H "Authorization: Bearer {token}" \
  http://localhost:3003/schedule/api/schedule/schedule-entries-teacher/124
# ✗ 403 Forbidden
```

---

### Create Excused Absence
**Endpoint:** `POST /schedule/api/schedule/excused-absence`

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "teacher_id": 123,
  "schedule_entry_id": null,
  "reason": "Medical appointment scheduled",
  "date": "2025-11-26"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "teacher_id": 123,
    "schedule_entry_id": null,
    "reason": "Medical appointment scheduled",
    "date": "2025-11-26",
    "created_at": "2025-11-25T15:30:00Z"
  }
}
```

**Response (400 Bad Request - Missing Fields):**
```json
{
  "success": false,
  "error": "All required fields must be provided: teacher_id, reason, date"
}
```

**Response (403 Forbidden - Creating for Others):**
```json
{
  "success": false,
  "error": "You can only create excused absences for yourself"
}
```

**Authorization:** Teacher/Admin
**Validation:**
- teacher_id: Required, number
- reason: Required, 10-500 characters
- date: Required, YYYY-MM-DD format
- schedule_entry_id: Optional, number
- **Restriction:** Teacher can only create for self (teacher_id === user.id)

**Example:**
```bash
# Valid request
curl -X POST http://localhost:3003/schedule/api/schedule/excused-absence \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "teacher_id": 123,
    "reason": "Doctor appointment",
    "date": "2025-11-26"
  }'
# ✓ 201 Created

# Trying to create for another teacher
curl -X POST http://localhost:3003/schedule/api/schedule/excused-absence \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "teacher_id": 124,
    "reason": "Doctor appointment",
    "date": "2025-11-26"
  }'
# ✗ 403 Forbidden
```

---

### Get Personal Excused Absences
**Endpoint:** `GET /schedule/api/schedule/excused-absence/{teacher_id}`

**Headers:** 
- `Authorization: Bearer {token}`

**URL Parameters:**
- `teacher_id` - Teacher ID (must match authenticated user's id)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "teacher_id": 123,
      "reason": "Medical appointment",
      "date": "2025-11-26",
      "created_at": "2025-11-25T15:30:00Z"
    }
  ]
}
```

**Response (403 Forbidden - Viewing Others):**
```json
{
  "success": false,
  "error": "You can only view your own excused absences"
}
```

**Authorization:** Teacher/Admin
**Restriction:** Teacher can only view own (teacher_id === user.id)

---

## Student Endpoints

### Get Personal Absence Cards
**Endpoint:** `GET /schedule/api/schedule/absences-student/{student_id}`

**Headers:** 
- `Authorization: Bearer {token}`

**URL Parameters:**
- `student_id` - Student ID (must match authenticated user's id)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1000,
      "subject_id": 5,
      "absent_count": 3,
      "excused_count": 1,
      "total_sessions": 20
    }
  ]
}
```

**Authorization:** Student/Admin
**Restriction:** Student can only view own (student_id === user.id)

---

### Get Personal Groupe Schedule
**Endpoint:** `GET /schedule/api/schedule/schedule-entries-groupe/{groupe_id}`

**Headers:** 
- `Authorization: Bearer {token}`

**URL Parameters:**
- `groupe_id` - Groupe ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Schedule entries retrieved successfully",
  "data": [
    {
      "id": 1,
      "subject_id": 5,
      "teacher_id": 123,
      "classroom_id": 2,
      "groupe_id": 3,
      "day": "Monday",
      "time_slot": "09:00-10:30"
    }
  ]
}
```

**Authorization:** Student/Admin

---

## Error Responses

### 401 Unauthorized (Invalid/Missing Token)
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden (Insufficient Permissions)
```json
{
  "message": "Access denied. Insufficient permissions.",
  "error": "You can only access X from your own Y"
}
```

### 400 Bad Request (Invalid Parameters)
```json
{
  "success": false,
  "message": "All fields are required",
  "error": "Invalid input"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer {access_token}
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiLi4uIn0..." \
  http://localhost:3003/schedule/api/schedule/schedule-entries-teacher/123
```

---

## Base URLs

- **Auth Service:** `http://localhost:4000`
- **Ref Service:** `http://localhost:3001`
- **Schedule Service:** `http://localhost:3003`
- **API Gateway:** `http://localhost:3000`

---

## Rate Limiting

No rate limiting currently implemented. Recommended to add:
- 100 requests per minute per IP
- 1000 requests per hour per user
- Higher limits for admin users

---

## Versioning

Current API version: `v1`
- All endpoints are `/api/{service}/...`
- No version prefix currently used

---

## CORS Configuration

Ensure CORS is configured to allow frontend requests:
```javascript
// Typically in each service's server.js
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
```

---

## Testing with curl

### Login and Get Token
```bash
RESPONSE=$(curl -s -X POST http://localhost:4000/auth/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cin":"12345","password":"password"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"
```

### Use Token in Request
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/ref/api/coreacademy/departments
```

### Create Excused Absence
```bash
curl -X POST http://localhost:3003/schedule/api/schedule/excused-absence \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "teacher_id": 123,
    "reason": "Doctor appointment",
    "date": "2025-11-26"
  }'
```

---

## API Response Codes Summary

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid parameters, missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions, wrong department/user |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

**API Documentation Version:** 1.0  
**Last Updated:** November 25, 2025
