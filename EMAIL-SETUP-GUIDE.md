# Phase 7: Email Sending - Testing Guide

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB running
- MailTrap account (free) at https://mailtrap.io/

### Step 1: Configure MailTrap Credentials

1. **Sign up at MailTrap:**
   - Visit https://mailtrap.io/
   - Create a free account
   - Verify your email

2. **Get Your Credentials:**
   - Click "Sending" in the sidebar
   - Click "Integrations"
   - Choose "NodeMailer"
   - You'll see something like:
     ```
     host: 'smtp.mailtrap.io';
     port: 2525;
     auth: {
       user: '12345a67b8c9d0e1f2345678',
       pass: '9f8e7d6c5b4a3210fedcba98'
     }
     ```

3. **Update .env File:**
   ```env
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USER=your_username_here
   MAILTRAP_PASS=your_password_here
   MAILTRAP_FROM=noreply@authsystem.com
   ```

### Step 2: Start the Server

```bash
npm install
npm start
```

You should see:
```
✓ Server running on port 5000
```

### Step 3: Test Email Sending with Postman

#### Test Flow:

1. **STEP 1: Register a User**
   - Open Postman
   - Import `Auth-System-Postman.json` collection
   - Run the **"Register"** request
   - You should get a 201 response:
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

2. **STEP 2: Check MailTrap Inbox**
   - Go to https://mailtrap.io/
   - Click "In Progress" (or your inbox)
   - You should see an email with:
     - **From**: noreply@authsystem.com
     - **Subject**: Verify Your Account
     - **Body**: Contains a 6-digit OTP and formatted message

3. **STEP 3: Copy the OTP**
   - From the MailTrap email, copy the 6-digit OTP
   - Example: If you see "482193" in the email, copy that

4. **STEP 4: Verify OTP**
   - Go back to Postman
   - Run the **"Verify OTP"** request
   - Update the OTP in the body:
     ```json
     {
       "email": "testuser@mailinator.com",
       "otp": "482193"
     }
     ```
   - You should get a 200 response with `isVerified: true`

5. **STEP 5: Check Verification Email**
   - Go back to MailTrap
   - You should now see a second email:
     - **Subject**: Account Verified Successfully
     - **Body**: Welcome message

6. **STEP 6: Login**
   - Run the **"Login"** request with the registered credentials
   - You should successfully log in

---

## Email Format

### OTP Verification Email

**Subject:** Verify Your Account

**HTML Body:**
```
┌─────────────────────────────────────────────┐
│  Verify Your Account                        │
│                                             │
│  Your OTP (One-Time Password) for account  │
│  verification is:                          │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  4 8 2 1 9 3                        │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  Note: This OTP is valid for 5 minutes     │
│  only. Do not share this code.             │
│                                             │
│  If you did not request this code,         │
│  please ignore this email.                 │
└─────────────────────────────────────────────┘
```

**Plain Text Body:**
```
Your OTP is 482193. This is valid for 5 minutes only.
```

---

## Resend OTP Test

1. **Run "Resend OTP" request:**
   ```json
   {
     "email": "testuser@mailinator.com"
   }
   ```

2. **Response:**
   ```json
   {
     "success": true,
     "message": "OTP resent successfully"
   }
   ```

3. **Check MailTrap:**
   - You'll receive a new email with a new OTP
   - You have 5 minutes to use it

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not arriving | Check MAILTRAP credentials in .env |
| 500 error on register | Ensure MongoDB is running |
| OTP email shows in MailTrap but not live mail | MailTrap is a sandbox - designed for testing only |
| "Too many failed attempts" | Delete the OTP and restart registration |
| Connection timeout | Check internet connection and MailTrap port 2525 accessibility |

---

## Email Endpoints Summary

### Register (sends OTP)
```
POST /api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "TestPass123",
  "confirmPassword": "TestPass123"
}
```

### Resend OTP (sends new OTP email)
```
POST /api/auth/resend-otp
Body: {
  "email": "test@example.com"
}
```

### Verify OTP (sends verification email on success)
```
POST /api/auth/verify-otp
Body: {
  "email": "test@example.com",
  "otp": "482193"
}
```

---

## Code Implementation Details

### Email Utility (`src/utils/emailUtils.js`)
- Uses NodeMailer for email sending
- MailTrap SMTP configuration
- HTML and plain text email formats
- Error handling for failed emails

### Email Integration Points
1. **Register Controller**: Sends OTP after user creation
2. **Resend OTP Controller**: Sends new OTP to unverified user
3. **Verify OTP Controller**: Sends verification success email

### Features
- 5-minute OTP expiration
- Colored OTP display in HTML
- Professional email templates
- Graceful error handling (doesn't block registration if email fails)

---

## Next Steps

1. Deploy to production with real email provider (Gmail, SendGrid, etc.)
2. Add email templates
3. Implement email verification link (alternative to OTP)
4. Add password reset emails
5. Add notification emails
