# SAJSSM - Shri Amarnath Ji Selfless Service Mission

<div align="center">

![SAJSSM Logo](https://img.shields.io/badge/SAJSSM-Service%20with%20Compassion-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js->=14.0.0-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge)

**A comprehensive platform dedicated to serving pilgrims with love and compassion during their sacred Amarnath Ji pilgrimage journey.**

[Website](#) • [Documentation](#documentation) • [Contributing](#contributing) • [License](#license)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Admin Dashboard](#admin-dashboard)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

---

## 🙏 Overview

**SAJSSM (Shri Amarnath Ji Selfless Service Mission)** is a dedicated platform serving pilgrims undertaking the sacred journey to Amarnath Ji. Since 2008, SAJSSM has been providing compassionate service to lakhs of pilgrims through:

- 🍲 **Free Langar Services** - Nutritious meals for all pilgrims
- 🏥 **Medical Support** - Basic medicines and first-aid assistance
- 🛡️ **Safety & Guidance** - Volunteer support throughout the yatra route
- ❤️ **Community Service** - Special care for elderly, women, and differently-abled pilgrims

This full-stack web application enables:
- Public donation management and tracking
- Volunteer coordination and scheduling
- Yatra information and updates
- Gallery and announcements
- Admin dashboard for organization management
- Real-time statistics and reporting

---

## ✨ Key Features

### For Pilgrims & Donors

- 📱 **Easy Donation System** - Simple interface to contribute to the cause
  - Support for screenshot-based proof of payments
  - Real-time donation tracking and verification
  - Instant receipt generation
  
- 📖 **Yatra Information** - Comprehensive guides about the pilgrimage
  - Route information and difficulty levels
  - Best times to visit
  - Necessary preparations and equipment
  - Historical significance
  
- 📸 **Photo Gallery** - Visual memories from yatra journeys
  - Organized photo albums
  - High-quality image uploads
  - Community contributions
  
- 📢 **Announcements** - Important updates and notifications
  - Live ticker with latest updates
  - Emergency alerts
  - Schedule announcements
  
- 📧 **Contact System** - Direct communication channel
  - Contact form for inquiries
  - Message tracking
  - Response management

### For Administrators

- 🔐 **Secure Admin Login** - JWT-based authentication
  - Password change functionality
  - Session management
  - Role-based access control
  
- 📊 **Dashboard Analytics**
  - Real-time donation statistics
  - Pilgrim count tracking
  - Volunteer management
  - Fundraising progress visualization
  
- ✅ **Donation Verification**
  - Review pending donations
  - Screenshot verification
  - Payment confirmation workflow
  - Automated verification tracking
  
- 📝 **Content Management**
  - Create and manage announcements
  - Update yatra information
  - Manage gallery photos
  - Configure site settings
  
- 👥 **Volunteer Management**
  - Volunteer registration
  - Task assignment
  - Shift scheduling
  
- 📊 **Reporting & Analytics**
  - Donation reports
  - Pilgrim statistics
  - Performance metrics

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js 5.2
- **Language**: Node.js (>=14.0.0)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**:
  - Helmet.js for HTTP headers security
  - bcryptjs for password hashing
  - CORS for cross-origin requests
  - Express rate limiting
  - Joi for data validation
- **File Upload**: Multer 2.1
- **Validation**: Express Validator 7.0

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 8.0
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design
- **Development**: React DOM, Vite React Plugin

### DevOps & Deployment
- **Hosting**: Vercel
- **Database Hosting**: MongoDB Atlas (Cloud)
- **Version Control**: Git & GitHub

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend (React)                 │
│  ┌─────────────────────────────────────────────────┐│
│  │  Pages: Home, Yatra, Gallery, Donations, Admin  ││
│  │  Components: Header, Footer, Forms, Dashboard   ││
│  │  Services: API Client, Validation, Helpers      ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
                        ↕ (Axios)
┌─────────────────────────────────────────────────────┐
│                  Backend (Express.js)               │
│  ┌─────────────────────────────────────────────────┐│
│  │  Routes: Auth, Donations, Yatra, Gallery, etc.  ││
│  │  Controllers: Business Logic & API Handlers     ││
│  │  Middleware: Auth, Validation, Error Handling   ││
│  │  Models: Data Schema Definitions                ││
│  │  Services: Donation Processing & Utilities      ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
                        ↕ (Mongoose)
┌─────────────────────────────────────────────────────┐
│         Database (MongoDB Atlas/Local)              │
│  ┌─────────────────────────────────────────────────┐│
│  │  Collections: Admin, Donations, Announcements   ││
│  │  Yatra, Gallery, Contacts, Ticker, Settings    ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### API Architecture

- **RESTful API** design with standard HTTP methods
- **JWT Authentication** for secured endpoints
- **Rate Limiting** on critical endpoints
- **Input Validation** at multiple layers
- **Error Handling** with consistent response format
- **Multer Integration** for file uploads

---

## 📁 Project Structure

```
SAJSSM/
├── backend/                          # Express.js Backend
│   ├── server/
│   │   ├── server.js                 # Main server entry point
│   │   ├── seed.js                   # Database seeding script
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection config
│   │   ├── controllers/
│   │   │   ├── DonationController.js  # Donation logic
│   │   │   └── ...                   # Other controllers
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authentication
│   │   │   └── ...                   # Other middleware
│   │   ├── models/
│   │   │   ├── Admin.js              # Admin schema
│   │   │   ├── Donation.js           # Donation schema
│   │   │   ├── Announcement.js       # Announcement schema
│   │   │   ├── Contact.js            # Contact schema
│   │   │   ├── GalleryPhoto.js       # Gallery schema
│   │   │   ├── SiteSetting.js        # Settings schema
│   │   │   ├── Ticker.js             # Ticker schema
│   │   │   └── YatraDocument.js      # Yatra schema
│   │   ├── routes/
│   │   │   ├── auth.js               # Authentication routes
│   │   │   ├── donations.js          # Donation routes
│   │   │   ├── announcements.js      # Announcement routes
│   │   │   ├── gallery.js            # Gallery routes
│   │   │   ├── contacts.js           # Contact routes
│   │   │   ├── settings.js           # Settings routes
│   │   │   ├── ticker.js             # Ticker routes
│   │   │   └── yatra.js              # Yatra routes
│   │   ├── services/
│   │   │   ├── DonationService.js    # Donation business logic
│   │   │   └── ...                   # Other services
│   │   ├── validations/
│   │   │   ├── DonationValidator.js  # Donation validation
│   │   │   └── ...                   # Other validators
│   │   └── uploads/
│   │       └── donation-screenshots/ # Uploaded files storage
│   ├── api/
│   │   └── index.js                  # Serverless function for Vercel
│   ├── create-admin.js               # Admin creation script
│   └── package.json                  # Backend dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   ├── components/
│   │   │   ├── DonationForm.jsx      # Donation form component
│   │   │   ├── DonationStats.jsx     # Statistics display
│   │   │   ├── ErrorBoundary.jsx     # Error handling
│   │   │   └── common/               # Reusable components
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── AnnouncementPopup.jsx
│   │   │       ├── Ticker.jsx
│   │   │       └── ...
│   │   ├── pages/                    # Page components
│   │   │   ├── Home/
│   │   │   ├── About/
│   │   │   ├── Yatra/
│   │   │   ├── Gallery/
│   │   │   ├── Donations/
│   │   │   ├── Contact/
│   │   │   ├── History/
│   │   │   └── Admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       └── panels/           # Admin sub-panels
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── hooks/
│   │   │   ├── useAPI.js             # API hook
│   │   │   └── useForm.js            # Form handling hook
│   │   ├── utils/
│   │   │   ├── helpers.js            # Helper functions
│   │   │   └── validation.js         # Validation utilities
│   │   ├── constants/
│   │   │   ├── messages.js           # App messages
│   │   │   └── theme.js              # Theme configuration
│   │   ├── styles/
│   │   │   └── global.css            # Global styles
│   │   └── routes/
│   │       └── index.jsx             # Route definitions
│   ├── public/
│   │   ├── Images/                   # Static images
│   │   └── Docs/                     # Documentation files
│   ├── index.html                    # HTML template
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite configuration
│
├── render.yaml                       # Render deployment config
├── vercel.json                       # Vercel deployment config
└── README.md                         # This file
```

---

## 📦 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** >= 14.0.0 ([Download](https://nodejs.org/))
- **npm** >= 6.0.0 or **yarn** >= 1.22.0
- **Git** for version control
- **MongoDB** - Either:
  - Local MongoDB installation
  - MongoDB Atlas account (Cloud database)
- **Code Editor** - VS Code recommended
- **.env file** - For environment variables (see [Configuration](#configuration))

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/SAJSSM.git
cd SAJSSM
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify installation
npm list
```

**Backend Dependencies Installed:**
- express (5.2.1)
- mongoose (9.3.3)
- cors (2.8.6)
- helmet (7.1.0)
- jsonwebtoken (9.0.3)
- bcryptjs (3.0.3)
- multer (2.1.1)
- express-validator (7.0.0)
- joi (17.11.0)
- dotenv (17.3.1)

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Verify installation
npm list
```

**Frontend Dependencies Installed:**
- react (18.2.0)
- react-dom (18.2.0)
- react-router-dom (6.20.0)
- axios (1.6.0)
- vite (8.0.1)

### Step 4: Database Setup

#### Option A: Using MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database user
3. Get your connection string
4. Whitelist your IP address in Network Access

#### Option B: Using Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

---

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sajssm?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars_recommended
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=2097152
UPLOAD_DIR=uploads/donation-screenshots

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Logging
LOG_LEVEL=debug
```

**Important Security Notes:**
- Never commit `.env` files to version control
- Use strong JWT secrets (minimum 32 characters)
- Keep database credentials secure
- Use different secrets for development and production

### Frontend Configuration

Create a `.env` file in the `frontend` directory (optional):

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
VITE_PUBLIC_PATH=/

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

---

## ▶️ Running the Application

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Output:**
```
📡 Connecting to MongoDB...
✅ MongoDB Connected: cluster0.mongodb.net
📊 Database: sajssm
🚀 Server running on http://localhost:5001
```

#### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

**Output:**
```
  VITE v8.0.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### Terminal 3 (Optional): Database Seeding

```bash
cd backend
npm run seed
```

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist/`

#### Build Backend
```bash
cd backend
npm run build
```

### Create Admin User

```bash
cd backend
npm run create-admin
# Follow the prompts to enter admin username and password
```

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5001/api`
- **Production**: `https://your-domain.com/api`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "data": { /* response data */ },
  "message": "Optional message"
}
```

---

### 🔐 Authentication Endpoints

#### Login
```
POST /api/auth/login
```

**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "507f1f77bcf86cd799439011",
      "username": "admin"
    }
  }
}
```

#### Get Profile
```
GET /api/auth/me
Authorization: Bearer <TOKEN>
```

#### Change Password
```
PUT /api/auth/password
Authorization: Bearer <TOKEN>
```

**Request:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

---

### 💰 Donation Endpoints

#### Create Donation
```
POST /api/donations
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
- name: John Doe
- email: john@example.com
- phone: +919876543210
- amount: 5000
- paymentMethod: upi
- transactionId: UPI12345678
- screenshot: <file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "amount": 5000,
    "status": "pending",
    "createdAt": "2024-04-22T10:30:00Z"
  }
}
```

#### Get Donation Stats (Admin)
```
GET /api/donations/stats
Authorization: Bearer <TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": 1250000,
    "totalDonors": 345,
    "pendingCount": 12,
    "verifiedCount": 508,
    "averageDonation": 3676.47
  }
}
```

#### Get Pending Donations (Admin)
```
GET /api/donations/pending?page=1&limit=10
Authorization: Bearer <TOKEN>
```

#### Get Verified Donations (Admin)
```
GET /api/donations/verified?page=1&limit=10
Authorization: Bearer <TOKEN>
```

#### Verify Donation (Admin)
```
PUT /api/donations/:id/verify
Authorization: Bearer <TOKEN>
```

#### Get Donations by Phone
```
GET /api/donations/by-phone/:phone
Authorization: Bearer <TOKEN>
```

---

### 📢 Announcement Endpoints

#### Get All Announcements
```
GET /api/announcements
```

#### Create Announcement (Admin)
```
POST /api/announcements
Authorization: Bearer <TOKEN>
```

#### Update Announcement (Admin)
```
PUT /api/announcements/:id
Authorization: Bearer <TOKEN>
```

#### Delete Announcement (Admin)
```
DELETE /api/announcements/:id
Authorization: Bearer <TOKEN>
```

---

### 📖 Yatra Endpoints

#### Get Yatra Information
```
GET /api/yatra
```

#### Update Yatra (Admin)
```
PUT /api/yatra/:id
Authorization: Bearer <TOKEN>
```

---

### 📸 Gallery Endpoints

#### Get Gallery Photos
```
GET /api/gallery?page=1&limit=12
```

#### Upload Photo (Admin)
```
POST /api/gallery
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
```

#### Delete Photo (Admin)
```
DELETE /api/gallery/:id
Authorization: Bearer <TOKEN>
```

---

### 📧 Contact Endpoints

#### Submit Contact Form
```
POST /api/contacts
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "subject": "Inquiry",
  "message": "Hello, I would like to know more..."
}
```

#### Get Contacts (Admin)
```
GET /api/contacts?page=1&limit=20
Authorization: Bearer <TOKEN>
```

---

## 📊 Database Models

### Admin Schema
```javascript
{
  username: String (unique, required),
  passwordHash: String (hashed, required),
  email: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Donation Schema
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  amount: Number (required, min: 100),
  paymentMethod: String (enum: ['upi', 'bank', 'card']),
  transactionId: String (unique, required),
  screenshotPath: String,
  status: String (enum: ['pending', 'verified', 'rejected']),
  notes: String,
  verifiedBy: ObjectId (ref: Admin),
  verifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Announcement Schema
```javascript
{
  title: String (required),
  content: String (required),
  category: String,
  priority: String (enum: ['low', 'medium', 'high']),
  status: String (enum: ['draft', 'published', 'archived']),
  displayOnTicker: Boolean,
  createdBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Schema
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'responded']),
  response: String,
  respondedAt: Date,
  createdAt: Date
}
```

### GalleryPhoto Schema
```javascript
{
  title: String (required),
  description: String,
  photoPath: String (required),
  album: String,
  uploadedBy: ObjectId (ref: Admin),
  viewCount: Number,
  createdAt: Date
}
```

### YatraDocument Schema
```javascript
{
  title: String (required),
  description: String,
  content: String (required),
  category: String,
  order: Number,
  published: Boolean,
  updatedBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Ticker Schema
```javascript
{
  message: String (required),
  status: String (enum: ['active', 'inactive']),
  displayOrder: Number,
  createdAt: Date
}
```

### SiteSetting Schema
```javascript
{
  key: String (unique, required),
  value: String,
  description: String,
  updatedAt: Date
}
```

---

## 🎛️ Admin Dashboard

### Features

- **Authentication**: Secure login with JWT
- **Dashboard Overview**: Key metrics and statistics
- **Donation Management**:
  - View pending donations
  - Verify donations with screenshots
  - Track donation status
  - Generate reports
- **Content Management**:
  - Create/Edit announcements
  - Manage yatra information
  - Update gallery photos
  - Manage site settings
- **Communication**:
  - View contact form submissions
  - Respond to inquiries
  - Track communication history
- **User Management**:
  - Admin profile management
  - Password change
  - Session management

### Accessing Admin Dashboard

1. Navigate to: `http://localhost:5173/admin`
2. Login with admin credentials
3. Access admin features from dashboard

---

## 🔒 Security Features

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT token-based authentication
   - 24-hour token expiration
   - Secure password hashing with bcryptjs

2. **HTTP Security**
   - Helmet.js for security headers
   - Content Security Policy (CSP)
   - HTTP Strict Transport Security (HSTS)
   - Clickjacking prevention

3. **Rate Limiting**
   - Login rate limiting: 5 attempts per 15 minutes
   - API rate limiting: 100 requests per minute
   - Donation rate limiting: 10 per hour

4. **Input Validation**
   - Joi schema validation
   - Express validator on all endpoints
   - File type and size restrictions
   - Sanitization of user inputs

5. **CORS Protection**
   - Whitelist of allowed origins
   - Credentials support configuration
   - Preflight request handling

6. **File Upload Security**
   - File type validation (JPG, PNG only)
   - File size limit: 2MB
   - Unique filename generation
   - Secure storage location

7. **Database Security**
   - Mongoose schema validation
   - Password field exclusion from responses
   - Indexed queries for performance

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository
- MongoDB Atlas database

#### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the SAJSSM project

3. **Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     ```
     MONGO_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=your_vercel_domain
     ```

4. **Deploy**
   - Vercel will automatically detect the monorepo structure
   - Build process will run automatically
   - Site will be live at `your-project.vercel.app`

### Render Deployment (Alternative)

See `render.yaml` for Render-specific configuration.

### Environment-Specific Configuration

Update these for production:

```env
# Production
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
JWT_EXPIRE=24h
LOG_LEVEL=error
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to contribute:

### Prerequisites
- Fork the repository
- Clone your fork
- Create a new branch for your feature

### Development Workflow

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

3. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

Commit message format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for code style changes
- `test:` for tests
- `refactor:` for code refactoring

4. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Describe your changes
   - Link any related issues
   - Request review from maintainers

### Code Standards

- Use meaningful variable names
- Add JSDoc comments for functions
- Write modular, reusable code
- Follow DRY principle
- Add error handling

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### MongoDB Connection Error
**Error**: `MongoDB Connection Error: getaddrinfo ENOTFOUND`

**Solution**:
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check whitelist IP in MongoDB Atlas
- Test connection string in MongoDB Compass

#### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify CORS_ORIGIN in .env matches frontend URL
- Check if backend is running on correct port
- Clear browser cache and cookies
- Test API directly with Postman

#### Port Already in Use
**Error**: `listen EADDRINUSE: address already in use :::5001`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5001
kill -9 <PID>
```

#### JWT Authentication Failed
**Error**: `jwt malformed` or `jwt expired`

**Solution**:
- Ensure token is being sent in Authorization header
- Check JWT_SECRET matches between requests
- Verify token hasn't expired
- Re-login to get fresh token

#### File Upload Error
**Error**: `File size exceeds limit` or `Only JPG and PNG files allowed`

**Solution**:
- Check file size is under 2MB
- Ensure file format is JPG or PNG
- Verify upload directory exists
- Check disk space availability

#### Vite Dev Server Not Loading
**Error**: `connect ECONNREFUSED 127.0.0.1:5173`

**Solution**:
```bash
cd frontend
npm run dev
# Restart if port conflict
npm run dev -- --port 3000
```

### Debug Mode

Enable verbose logging:

**Backend** (server.js):
```javascript
process.env.LOG_LEVEL = 'debug';
```

**Frontend** (.env):
```env
VITE_ENABLE_DEBUG=true
```

### Check Logs

**Backend Logs**:
```bash
cd backend
npm run dev 2>&1 | tee server.log
```

**Browser Console**:
- Open DevTools (F12)
- Check Console, Network, and Application tabs

---

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

```
ISC License (ISC)

Permission to use, copy, modify, and/or distribute copies of this software 
and associated documentation files (the "Software"), is hereby granted, 
provided that the above copyright notice and this permission notice appear 
in all copies.
```

---

## 📞 Contact & Support

### Get in Touch

- **Email**: contact@sajssm.org
- **Phone**: +91 XXXX-XXX-XXXX
- **Website**: www.sajssm.org
- **GitHub Issues**: [Report Issues](https://github.com/yourusername/SAJSSM/issues)
- **Discussions**: [Start Discussion](https://github.com/yourusername/SAJSSM/discussions)

### Support Resources

- 📖 [Full Documentation](./docs)
- 🎥 [Video Tutorials](https://youtube.com)
- 💬 [Community Forum](https://forum.example.com)
- 🐛 [Report a Bug](https://github.com/yourusername/SAJSSM/issues/new)
- ✨ [Request a Feature](https://github.com/yourusername/SAJSSM/issues/new)

---

## 🙏 Acknowledgments

- **SAJSSM Team**: For their dedication to serving pilgrims
- **Contributors**: For their valuable contributions
- **Community**: For feedback and support
- **Technologies**: Express.js, React, MongoDB communities

---

## 📈 Project Statistics

| Metric | Value |
|--------|-------|
| Backend Size | ~50+ files |
| Frontend Size | ~40+ components |
| Database Collections | 8 |
| API Endpoints | 30+ |
| Test Coverage | TBD |
| Last Updated | 2024-04-22 |

---

## 🗓️ Development Roadmap

### Current Release (v1.0.0)
- ✅ Core donation system
- ✅ Admin dashboard
- ✅ Yatra information
- ✅ Gallery management

### Upcoming Features
- 🔄 Payment gateway integration (Razorpay, PhonePe)
- 🔄 Email notifications
- 🔄 SMS alerts
- 🔄 Advanced analytics
- 🔄 Mobile app (React Native)
- 🔄 Multi-language support
- 🔄 Volunteer mobile app

---

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial release
- Core functionality implemented
- Secure JWT authentication
- MongoDB integration
- Responsive design
- Rate limiting and security measures

For detailed changelog, see [CHANGELOG.md](./CHANGELOG.md)

---

<div align="center">

**Made with ❤️ for serving pilgrims**

[⬆ back to top](#sajssm---shri-amarnath-ji-selfless-service-mission)

</div>
