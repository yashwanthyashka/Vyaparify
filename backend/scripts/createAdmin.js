// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // update path as needed

mongoose.connect('mongodb://localhost:27017/vyaparify', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = new User({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    isAdmin: true
  });

  await admin.save();
  console.log('✅ Admin user created!');
  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Error creating admin:', err);
});
