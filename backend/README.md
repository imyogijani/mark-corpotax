# FinBest Finance Backend API

A robust Node.js/Express backend API for the FinBest Finance application with TypeScript, MongoDB, and comprehensive security features.

## 🚀 Features

- **RESTful API** with Express.js and TypeScript
- **MongoDB** integration with Mongoose ODM
- **Authentication & Authorization** with JWT
- **Security** middleware (Helmet, CORS, Rate Limiting)
- **Input Validation** with Joi
- **Email Services** with Nodemailer
- **File Upload** capabilities with Multer
- **Error Handling** with centralized error middleware
- **Logging** with Morgan
- **Environment Configuration** with dotenv

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── rateLimiter.ts       # Rate limiting middleware
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── appointment.ts       # Appointment booking routes
│   │   ├── blog.ts              # Blog management routes
│   │   ├── contact.ts           # Contact form routes
│   │   └── service.ts           # Services routes
│   └── server.ts                # Main server file
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/finbest-db
   JWT_SECRET=your-super-secret-jwt-key-here
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-email-password
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   - Install and start MongoDB locally, or
   - Use MongoDB Atlas cloud service

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Other Scripts
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm test              # Run tests
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (Admin)

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get all appointments (Admin)
- `PUT /api/appointments/:id` - Update appointment status (Admin)

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create blog post (Admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

### Health Check
- `GET /health` - API health status

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation with Joi
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security

## 🗃️ Database Schema

The application uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `contacts` - Contact form submissions
- `appointments` - Appointment bookings
- `blogs` - Blog posts and content
- `services` - Service listings

## 📧 Email Configuration

The API supports email notifications for:
- Contact form submissions
- Appointment confirmations
- User registration
- Password reset requests

Configure your SMTP settings in the `.env` file.

## 🛡️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/finbest-db |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `SMTP_HOST` | Email SMTP host | smtp.gmail.com |
| `SMTP_PORT` | Email SMTP port | 587 |
| `SMTP_USER` | Email username | - |
| `SMTP_PASS` | Email password | - |

## 🧪 Testing

```bash
npm test
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
