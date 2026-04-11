require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Ticker = require('./models/Ticker');
const Announcement = require('./models/Announcement');
const YatraDocument = require('./models/YatraDocument');
const GalleryPhoto = require('./models/GalleryPhoto');
const SiteSetting = require('./models/SiteSetting');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // --- Admin ---
    const existingAdmin = await Admin.findOne({ username: 'Media-Coordinator' });
    if (!existingAdmin) {
      const hash = await Admin.hashPassword('SAJSSM132001');
      await Admin.create({ username: 'Media-Coordinator', passwordHash: hash });
      console.log('✅ Admin user created (Media-Coordinator / SAJSSM132001)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }


    // --- Site Settings ---
    const settingsCount = await SiteSetting.countDocuments();
    if (settingsCount === 0) {
      await SiteSetting.insertMany([
        { key: 'liveAartiLink', value: '' },
        { key: 'visitorMessage', value: 'Welcome to SAJSSM' },
      ]);
      console.log('✅ Site settings seeded');
    } else {
      console.log('ℹ️  Site settings already exist');
    }

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
