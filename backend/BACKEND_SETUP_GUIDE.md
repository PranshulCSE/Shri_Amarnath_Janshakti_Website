# Backend Setup & Debugging Guide

## ✅ Status Checks

### 1. Environment Configuration
```bash
cd backend
cat .env
```
Verify these are set:
- ✅ `MONGO_URI` - MongoDB connection string
- ✅ `JWT_SECRET` - Secret key for tokens (at least 16 characters)
- ✅ `PORT` - Server port (default: 5000)
- ✅ `NODE_ENV` - Set to 'development' for local dev

### 2. MongoDB Connection
```bash
# Verify MongoDB is running
# For local MongoDB:
mongosh

# Or check MongoDB Atlas connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/sajssm?retryWrites=true&w=majority
```

### 3. Dependencies Installation
```bash
cd backend
npm install
```

## 🚀 Running the Server

### Development Mode
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📍 API Base URL: http://localhost:5000/api
```

### Common Issues & Fixes

#### ❌ "Failed to connect to MongoDB"
**Causes:**
- MongoDB server not running
- Invalid MONGO_URI in .env
- Network firewall blocking connection

**Solutions:**
```bash
# For local MongoDB - check if running
# Windows: Services > MongoDB Server
# Mac/Linux:
brew services start mongodb-community

# For MongoDB Atlas - verify:
# 1. IP address is whitelisted
# 2. User password is correct (URL encode special chars: @ → %40)
# 3. Connection string format is correct
```

#### ❌ "Missing required environment variables"
**Solution:**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
```

#### ❌ "PORT already in use"
**Solution:**
```bash
# Change PORT in .env to 5001, 5002, etc.
# Or kill process using port 5000:
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

## 🧪 Testing the APIs

### 1. Test Server Health
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"ok","time":"2024-..."}`

### 2. Test Contact Form (Public)
```bash
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "subject": "Test",
    "message": "Test message"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "id": "..."
}
```

### 3. Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "admin": {
      "id": "...",
      "username": "admin"
    }
  }
}
```

### 4. Create Admin User (if needed)
```bash
cd backend
npm run create-admin
```
Then enter username and password when prompted.

### 5. Test Donation Form (Public)
```bash
# Using Postman or similar tool:
POST /api/donations
Form Data:
  - name: "Donor Name"
  - phone: "9876543210"
  - amount: 500
  - transactionId: "UPI123456789"
  - email: "donor@example.com"
  - screenshot: [file]
```

## 📊 Checking Logs

### Server Logs
```bash
# If server is running, look for:
# ✅ "MongoDB Connected"
# ✅ "Server running on port 5000"
# ❌ "Connection Error" - database issue
# ❌ "Missing required environment variables" - .env issue
```

### Check Database
```bash
# Connect to MongoDB and verify collections
mongosh
use sajssm
db.contacts.findOne()
db.donations.findOne()
db.admins.findOne()
```

## 🔍 Debugging Requests

### Enable Detailed Logging
Open `backend/server/server.js` and ensure this is enabled:
```javascript
if (process.env.NODE_ENV === 'development') {
  // All errors will show full stack trace
}
```

### Check Request/Response
```bash
# Use curl with verbose flag
curl -v http://localhost:5000/api/health
```

### Test with Postman
1. Import collection
2. Set `{{baseUrl}}` to `http://localhost:5000/api`
3. Send requests
4. Check response status and body

## 📋 Checklist Before Going Live

- [ ] .env file exists with all required variables
- [ ] MongoDB connection working
- [ ] `npm run create-admin` - admin user created
- [ ] `npm run dev` - server starts without errors
- [ ] All APIs respond from frontend
- [ ] Forms submit successfully
- [ ] Files upload for donations
- [ ] Admin login works
- [ ] JWT tokens are generated
- [ ] Validation errors return proper format

## 🚨 Emergency Reset

If everything is broken, start fresh:

```bash
# 1. Clear all data (careful!)
mongo/mongosh
use sajssm
db.dropDatabase()

# 2. Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# 3. Start fresh
npm run create-admin
npm run seed  # if seed.js exists
npm run dev
```

## 📞 Support

If issues persist, check:
1. **Browser Console** - frontend errors
2. **Terminal Output** - server errors
3. **MongoDB Logs** - database errors
4. **.env Configuration** - all vars set correctly
5. **Network** - firewall/proxy blocking requests

---

✅ All Issues Fixed! Your backend should now respond properly to:
- Admin login
- Contact form submissions
- Donation form submissions
