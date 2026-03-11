# PHASE 9: Login System with JWT Tokens - Complete Implementation

## 🎯 Objective Completed
Implement complete login system that checks email exists, compares password with bcrypt, and generates JWT tokens for authentication.

---

## 📋 Implementation Summary

### ✅ Complete Login Flow

```
┌─────────────────────────────────┐
│  User Provides Email + Password  │
│  POST /api/auth/login            │
│  { email, password }             │
└────────────┬──────────────────────┘
             ↓
┌─────────────────────────────────┐
│  STEP 1: Validate Input          │
│  Check email & password provided │
└────────────┬──────────────────────┘
             ↓
┌─────────────────────────────────┐  ✅ EMAIL EXISTS?
│  STEP 2: Check Email in DB       │
│  User.findOne({ email })         │
└────────────┬──────────────────────┘
             ↓
        [Found?]
        /        \
       Yes        No
       /           \
      ↓             ↓
      ↓        Return 401
      ↓        "Invalid email"
      ↓
┌─────────────────────────────────┐  ✅ COMPARE PASSWORD
│  STEP 3: Bcrypt Comparison       │
│  comparePassword(                │
│    inputPassword,                │
│    storedPasswordHash            │
│  )                               │
└────────────┬──────────────────────┘
             ↓
        [Match?]
        /        \
       Yes        No
       /           \
      ↓             ↓
      ↓        Return 401
      ↓        "Invalid password"
      ↓
┌─────────────────────────────────┐
│  STEP 4: Check Email Verified    │
│  user.isVerified === true        │
└────────────┬──────────────────────┘
             ↓
        [Verified?]
        /          \
       Yes         No
       /             \
      ↓               ↓
      ↓        Return 403
      ↓        "Verify email first"
      ↓
┌─────────────────────────────────┐  ✅ GENERATE TOKENS
│  STEP 5: Generate Access Token   │
│  jwt.sign(                        │
│    { id, email },                │
│    JWT_SECRET,                   │
│    { expiresIn: '7d' }           │
│  )                               │
└────────────┬──────────────────────┘
             ↓
┌─────────────────────────────────┐  ✅ GENERATE TOKENS
│  STEP 6: Generate Refresh Token  │
│  jwt.sign(                        │
│    { id },                        │
│    JWT_SECRET,                   │
│    { expiresIn: '30d' }          │
│  )                               │
└────────────┬──────────────────────┘
             ↓
┌─────────────────────────────────┐
│  STEP 7: Store Refresh Token     │
│  User.findByIdAndUpdate(         │
│    userId,                       │
│    { refreshToken: token }       │
│  )                               │
└────────────┬──────────────────────┘
             ↓
┌─────────────────────────────────┐
│  Return 200 OK                   │
│  {                               │
│    success: true,                │
│    tokens: {                     │
│      accessToken,                │
│      refreshToken                │
│    },                            │
│    user: { ...userData }         │
│  }                               │
└─────────────────────────────────┘
```

---

## 🔧 Implementation Details

### 1. **Email Validation**
```javascript
// Finds user by email
const user = await User.findOne({ email }).select('+passwordHash');
if (!user) {
  return 401 "Invalid email or password"
}
```

### 2. **Bcrypt Password Comparison**
```javascript
// Compares plain password with hashed password
const isPasswordValid = await comparePassword(
  password,
  user.passwordHash
);
if (!isPasswordValid) {
  return 401 "Invalid email or password"
}
```

### 3. **Email Verification Check**
```javascript
// Ensures account is verified before login
if (!user.isVerified) {
  return 403 "Please verify your email before logging in"
}
```

### 4. **Access Token Generation**
```javascript
// Payload: { id, email }
// Expires: 7 days (from JWT_EXPIRE env)
const accessToken = generateAccessToken(user._id, user.email);
```

### 5. **Refresh Token Generation**
```javascript
// Payload: { id }
// Expires: 30 days
// Used to get new access tokens
const refreshToken = generateRefreshToken(user._id);
```

### 6. **Database Storage**
```javascript
// Store refresh token in user document
await User.findByIdAndUpdate(
  user._id,
  { refreshToken },
  { new: true }
);
```

---

## 📊 Files Modified/Created

| File | Status | Changes |
|------|--------|---------|
| [src/utils/tokenUtils.js](src/utils/tokenUtils.js) | ✅ **NEW** | Token generation & verification utilities |
| [src/controllers/authController.js](src/controllers/authController.js) | ✅ **UPDATED** | Enhanced login + refresh token + logout |
| [src/routes/authRoutes.js](src/routes/authRoutes.js) | ✅ **UPDATED** | Added `/refresh-token` & `/logout` routes |
| [src/models/User.js](src/models/User.js) | ✅ **EXISTING** | `refreshToken` field already present |
| [.env](.env) | ✅ **EXISTING** | JWT_SECRET & JWT_EXPIRE already configured |

---

## 🧪 API Endpoints

### 1. POST `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "isVerified": true
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

```json
{
  "success": false,
  "message": "Please verify your email before logging in"
}
```

---

### 2. POST `/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

```json
{
  "success": false,
  "message": "Refresh token mismatch"
}
```

---

### 3. POST `/api/auth/logout`

**Request Body:**
```json
{
  "userId": "user_id"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🔐 JWT Token Structure

### Access Token
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "user_id", email: "user@example.com" }
Expires: 7 days
Secret: JWT_SECRET from .env
```

### Refresh Token
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "user_id" }
Expires: 30 days
Secret: JWT_SECRET from .env
Stored in: User.refreshToken (database)
```

---

## ✨ Key Features

| Feature | Status | Details |
|---------|--------|---------|
| Input Validation | ✅ | Email & password required |
| Email Lookup | ✅ | User.findOne({ email }) |
| Password Hashing | ✅ | Uses bcrypt comparePassword |
| Email Verification | ✅ | Checks isVerified before login |
| Access Token | ✅ | JWT with 7-day expiration |
| Refresh Token | ✅ | JWT with 30-day expiration |
| Token Storage | ✅ | Refresh token in database |
| Token Rotation | ✅ | New refresh token on refresh |
| Logout | ✅ | Clears refresh token |
| Error Handling | ✅ | Comprehensive error messages |

---

## 🧪 Testing Checklist

- [ ] **Test 1: Valid Login**
  - Register user
  - Verify email with OTP
  - Login with correct credentials
  - Receive both tokens

- [ ] **Test 2: Invalid Email**
  - Try to login with non-existent email
  - Confirm "Invalid email or password"

- [ ] **Test 3: Invalid Password**
  - Try to login with wrong password
  - Confirm "Invalid email or password"

- [ ] **Test 4: Unverified Email**
  - Register user but don't verify OTP
  - Try to login
  - Confirm "Please verify your email before logging in"

- [ ] **Test 5: Token Refresh**
  - Login and get tokens
  - Use refresh token to get new access token
  - Confirm new tokens are valid

- [ ] **Test 6: Logout**
  - Login to get tokens
  - Call logout endpoint
  - Try to use old refresh token
  - Confirm token mismatch error

- [ ] **Test 7: Token Expiration**
  - Create access token manually (mock short expiry)
  - Try to use expired token
  - Confirm token error

---

## 🚀 How to Use

### Step 1: Register & Verify User
```bash
# Register
POST /api/auth/register
{ "name": "John", "email": "john@example.com", "phone": "9876543210", "password": "pass123", "confirmPassword": "pass123" }

# Verify OTP
POST /api/auth/verify-otp
{ "email": "john@example.com", "otp": "123456" }
```

### Step 2: Login with Credentials
```bash
POST /api/auth/login
{ "email": "john@example.com", "password": "pass123" }

# Response includes:
# - accessToken (use in Authorization header)
# - refreshToken (store securely, use to get new access token)
```

### Step 3: Use Access Token
```bash
# Send with every request in Authorization header:
Authorization: Bearer <accessToken>
```

### Step 4: Refresh Token (When Access Token Expires)
```bash
POST /api/auth/refresh-token
{ "refreshToken": "<refreshToken>" }

# Receive new accessToken and refreshToken
```

### Step 5: Logout
```bash
POST /api/auth/logout
{ "userId": "user_id" }

# Refresh token is cleared from database
```

---

## 🔒 Security Features

✅ **Bcrypt Hashing**: Passwords are never compared in plain text  
✅ **Email Verification**: Only verified accounts can login  
✅ **Token Expiration**: Access tokens expire after 7 days  
✅ **Token Rotation**: Refresh tokens are rotated on each refresh  
✅ **Database Storage**: Refresh token stored for validation  
✅ **Secret Management**: JWT secret from .env file  
✅ **Error Messages**: Generic "Invalid email or password" prevents enumeration  

---

## 🌳 Environment Variables

Ensure these are set in `.env`:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

---

## 📝 Next Phase

**Phase 10: Authentication Middleware & Protected Routes**
- Create auth middleware to verify JWT tokens
- Protect routes with token verification
- Implement role-based access control (RBAC)
- Add admin-only endpoints

---

## ✅ Status: PHASE 9 COMPLETE

Complete login system with email check, bcrypt password comparison, and JWT token generation implemented and ready for middleware integration.
