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

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

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
| DB_HOST | Database host |
| DB_USER | Database user |
| DB_PASSWORD | Database password |
| DB_NAME | Database name |
| JWT_SECRET | Secret key for JWT tokens |
| JWT_EXPIRE | Token expiration time |

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License

## Author

Ramesh Raveendran
