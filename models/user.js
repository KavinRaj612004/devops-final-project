const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

// Create admin account on startup if not exists
(async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
      });
      await adminUser.save();
      console.log('Admin account created.');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
})();

module.exports = User;
