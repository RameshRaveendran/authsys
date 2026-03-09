# Auth System

A comprehensive authentication system built with Node.js and Express, featuring user registration, login, and authorization.

## Features

- User registration and login
- Password hashing and security
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected routes and middleware
- Environment variable configuration
- Error handling and validation

## Project Structure

```
auth-system/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── config/                # Configuration files (database, auth, etc.)
│   ├── controllers/           # Business logic for authentication
│   ├── middleware/            # Custom middleware (auth verification, etc.)
│   ├── models/                # Database models/schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Helper functions and utilities
│   └── views/                 # Frontend templates (if applicable)
├── tests/                     # Test files
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
└── readme.md                  # Project documentation
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your environment variables:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=auth_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## Getting Started

1. Start the development server:
```bash
npm start
```

2. The server will run on `http://localhost:5000`

## Email Configuration (MailTrap for Development)

### Setup Steps

1. **Create a MailTrap Account:**
   - Go to [https://mailtrap.io/](https://mailtrap.io/)
   - Sign up for a free account
   - Verify your email

2. **Get MailTrap Credentials:**
   - Log in to MailTrap dashboard
   - Go to **Sending** → **Integrations**
   - Select **NodeMailer**
   - Copy the credentials shown

3. **Configure .env File:**
   ```env
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USER=your_username_from_mailtrap
   MAILTRAP_PASS=your_password_from_mailtrap
   MAILTRAP_FROM=noreply@authsystem.com
   ```

4. **Test Email Sending:**
   - Register a new user via `/api/auth/register`
   - Check MailTrap inbox at [https://mailtrap.io/](https://mailtrap.io/)
   - You should receive an OTP email with the format:
     - **Subject**: Verify Your Account
     - **Body**: Your OTP is 482193 (6-digit code)

### Email Features

- **OTP Verification Email**: Sent during registration and resend OTP requests
- **Account Verification Email**: Sent after successful OTP verification
- **HTML and Text Formats**: Supports both for maximum compatibility
- **Error Handling**: Gracefully handles email failures

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user (sends OTP email)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-otp` - Verify OTP (sends verification email on success)
- `POST /api/auth/resend-otp` - Resend OTP email


## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL/MongoDB (configure in config/)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | Environment (development/production) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT tokens |
| JWT_EXPIRE | Token expiration time |
| MAILTRAP_HOST | MailTrap SMTP host (smtp.mailtrap.io) |
| MAILTRAP_PORT | MailTrap SMTP port (2525) |
| MAILTRAP_USER | MailTrap username |
| MAILTRAP_PASS | MailTrap password |
| MAILTRAP_FROM | Email sender address |

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License

## Author

Ramesh Raveendran
