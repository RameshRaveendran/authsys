# 🚀 QUICK START - Email Testing

## 1️⃣ Setup MailTrap (2 minutes)

```
1. Visit: https://mailtrap.io/
2. Sign up (free)
3. Click: Sending → Integrations → NodeMailer
4. Copy credentials
```

## 2️⃣ Configure .env (30 seconds)

```env
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=paste_username_here
MAILTRAP_PASS=paste_password_here
MAILTRAP_FROM=noreply@authsystem.com
```

## 3️⃣ Start Server (1 minute)

```bash
npm install
npm start
```

Expected output:
```
✓ Server running on port 5000
```

## 4️⃣ Test with Postman (2 minutes)

### A. Register User
**Endpoint**: `POST http://localhost:5000/api/auth/register`

**Body**:
```json
{
  "name": "Test User",
  "email": "testuser@mailinator.com",
  "phone": "9876543210",
  "password": "TestPass123",
  "confirmPassword": "TestPass123"
}
```

**Response** (should be 201):
```json
{
  "success": true,
  "message": "User registered successfully. OTP sent to email",
  "user": {
    "id": "...",
    "email": "testuser@mailinator.com",
    "isVerified": false
  }
}
```

### B. Check Email in MailTrap
**Go to**: https://mailtrap.io/ → Dashboard
**Look for**:
- Subject: "Verify Your Account"
- Body: Contains 6-digit OTP (e.g., 482193)

### C. Verify OTP
**Endpoint**: `POST http://localhost:5000/api/auth/verify-otp`

**Body**:
```json
{
  "email": "testuser@mailinator.com",
  "otp": "482193"
}
```

**Response** (should be 200):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "isVerified": true
  }
}
```

### D. Check Verification Email in MailTrap
**Look for**:
- Subject: "Account Verified Successfully"
- Body: Welcome message

### E. Login
**Endpoint**: `POST http://localhost:5000/api/auth/login`

**Body**:
```json
{
  "email": "testuser@mailinator.com",
  "password": "TestPass123"
}
```

**Response** (should be 200):
```json
{
  "success": true,
  "message": "Login successful"
}
```

---

## 📧 Expected Emails

### Email 1: OTP Verification
```
From: noreply@authsystem.com
Subject: Verify Your Account

Your OTP (One-Time Password) for account verification is:

      482193

Note: This OTP is valid for 5 minutes only.
```

### Email 2: Verification Success
```
From: noreply@authsystem.com
Subject: Account Verified Successfully

Welcome Test User!

Your account has been verified successfully. 
You can now log in to your account.
```

---

## 🔄 Resend OTP Flow

**Endpoint**: `POST http://localhost:5000/api/auth/resend-otp`

**Body**:
```json
{
  "email": "testuser@mailinator.com"
}
```

**Response** (should be 200):
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

**Note**: New OTP email will appear in MailTrap with a new code

---

## ⏰ OTP Validity

- ✅ OTP is valid for: **5 minutes**
- ✅ Failed attempts allowed: **3**
- ✅ After 3 fails: OTP deleted, must register again

---

## 🐛 If Email Doesn't Arrive

### Check 1: .env File
```bash
cat .env | grep MAILTRAP
```
Should show all 4 MAILTRAP variables filled

### Check 2: Server Logs
```bash
Look for: "[EMAIL] OTP sent successfully to..."
```

### Check 3: MailTrap Inbox
- Go to: https://mailtrap.io/
- Check "In Progress" section
- Click "Show" to see email

### Check 4: Resend
```bash
POST /api/auth/resend-otp
Body: {"email": "testuser@mailinator.com"}
```

---

## 📊 Complete Test Scenario

```
Step 1: POST /api/auth/register
  ↓ Success 201
  ↓ Email: "Verify Your Account"
  
Step 2: Copy OTP from Email
  
Step 3: POST /api/auth/verify-otp
  ↓ Success 200
  ↓ Email: "Account Verified Successfully"
  
Step 4: POST /api/auth/login
  ↓ Success 200
  ↓ Login complete!
```

---

## 🎯 Success Indicators

✅ Register returns 201
✅ OTP email appears in MailTrap within 1 second
✅ Email subject is "Verify Your Account"
✅ Email body contains 6-digit OTP
✅ Verify OTP returns 200
✅ Verification email appears in MailTrap
✅ Email subject is "Account Verified Successfully"
✅ Login returns 200 with user data

---

## 📝 Notes

- MailTrap is **sandbox for testing only** (emails don't go to real addresses)
- For production, use SendGrid, AWS SES, or Gmail
- Delete users between tests to avoid "email already registered" error
- OTP changes every time you resend

---

## 💬 API Response Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 201 | Created | Registration successful |
| 200 | OK | Verification/Login successful |
| 400 | Bad Request | Check request body |
| 401 | Unauthorized | Check email/password |
| 500 | Server Error | Check server logs |

---

**Testing complete! 🎉**
