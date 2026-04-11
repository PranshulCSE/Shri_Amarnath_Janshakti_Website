require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./server/models/Admin');

async function createAdmin() {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existing = await Admin.findOne({ username: 'Media-Coordinator' });
    if (existing) {
      console.log('⚠️  Admin already exists!');
      console.log('Admin ID:', existing._id);
      console.log('Username:', existing.username);

      // Re-hash and update the password to make sure it's correct
      const passwordHash = await Admin.hashPassword('SAJSSM132001');
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log('✅ Password has been reset to: SAJSSM132001');

      process.exit(0);
    }

    // Hash password
    const passwordHash = await Admin.hashPassword('SAJSSM132001');

    // Create admin
    const admin = await Admin.create({
      username: 'Media-Coordinator',
      passwordHash: passwordHash,
    });

    console.log('✅ Admin created successfully!');
    console.log('Username: Media-Coordinator');
    console.log('Password: SAJSSM132001');
    console.log('Admin ID:', admin._id);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
