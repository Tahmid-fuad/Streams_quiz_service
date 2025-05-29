
# Auth Service API

This is a simple authentication service built with Node.js and Express. It includes APIs for registering, logging in, managing user profiles, switching roles, and updating user information like name, email, and password.

## Base URL
```
http://localhost:<PORT>/api/auth
```

---

## 📋 API Endpoints

### 1. Register User
**POST** `/register`

#### Request Body (JSON)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Response
- **201 Created**: User registered successfully.
- **400 Bad Request**: Missing fields.
- **409 Conflict**: Email already exists.

---

### 2. Login User
**POST** `/login`

#### Request Body (JSON)
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Response
- **200 OK**: Returns JWT token and user info.
- **401 Unauthorized**: Invalid email or password.

---

### 3. Get User Profile
**GET** `/profile`

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response
- **200 OK**: Returns user profile.
- **401 Unauthorized**: Missing or invalid token.

---

### 4. Get User Role and Email
**GET** `/role`

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response
- **200 OK**: Returns role and email.

---

### 5. Switch User Role
**PATCH** `/switch-role`

#### Request Body (JSON)
```json
{
  "email": "john@example.com",
  "newRole": "admin"
}
```

#### Response
- **200 OK**: Role updated.
- **400 Bad Request**: Invalid input.
- **404 Not Found**: User not found.

---

### 6. Change User Name
**PATCH** `/change-name`

#### Request Body (JSON)
```json
{
  "email": "john@example.com",
  "password": "yourpassword",
  "newName": "Johnny"
}
```

#### Response
- **200 OK**: Name updated.
- **401 Unauthorized**: Incorrect password.

---

### 7. Change User Email
**PATCH** `/change-email`

#### Request Body (JSON)
```json
{
  "email": "john@example.com",
  "password": "yourpassword",
  "newEmail": "newjohn@example.com"
}
```

#### Response
- **200 OK**: Email updated.
- **400 Bad Request**: Email already in use or unchanged.

---

### 8. Change User Password
**PATCH** `/change-password`

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Request Body (JSON)
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### Response
- **200 OK**: Password updated.
- **401 Unauthorized**: Incorrect current password.

---

## 🛡️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- bcryptjs
- jsonwebtoken

---

## 🔐 Notes

- All routes that modify or fetch private data require JWT in headers.
- Tokens expire in 7 days.
- Only "admin" and "student" are allowed roles.
