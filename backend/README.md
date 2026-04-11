# SAJSSM Backend API

Node.js + Express + MongoDB REST API for SAJSSM website

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string and JWT secret.

### 3. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Default: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `PUT /api/auth/password` - Update password

### Donations
- `POST /api/donations` - Create donation (public)
- `GET /api/donations` - List donations (admin)
- `PUT /api/donations/:id/verify` - Verify donation (admin)

### Contacts
- `POST /api/contacts` - Submit contact form (public)
- `GET /api/contacts` - List contacts (admin)
- `PATCH /api/contacts/:id/read` - Mark as read (admin)

### Gallery
- `GET /api/gallery` - List gallery photos
- `POST /api/gallery` - Add photo (admin)

### Announcements
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Create announcement (admin)

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (admin)

## Project Structure

```
backend/
├── server.js           # Main server file
├── config/
│   └── db.js          # MongoDB connection
├── models/            # Mongoose schemas
├── controllers/       # Request handlers
├── routes/           # API routes
├── middleware/       # Authentication & validation
├── services/         # Business logic
├── validations/      # Joi schemas
└── uploads/          # File uploads
```

## Security Notes

- All sensitive routes require JWT authentication
- Passwords are hashed using bcryptjs
- CORS is configured for frontend domain
- File uploads limited to 10MB
- No DELETE operations on donations (immutable records)

## Database Seeding

```bash
npm run seed
```

This populates the database with initial admin user and test data.

## Error Handling

The server includes global error handling middleware that:
- Catches all unhandled errors
- Returns consistent JSON responses
- Prevents empty response bodies
- Logs errors to console
