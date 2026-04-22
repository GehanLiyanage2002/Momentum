const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving
// Hash password before saving (Modern Mongoose Syntax)
UserSchema.pre('save', async function() {
  // If the password hasn't been changed, just exit the function
  if (!this.isModified('password')) return;
  
  // Otherwise, hash it
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);