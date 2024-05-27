const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: [10, 'Password must be greater than 10 characters'],
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Only works on CREATE and SAVE!
      validator: function (v) {
        return v === this.password;
      }
    }
  },
});

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // We need the passwordConfirm field only for UX purposes, not to be persisted in DB
  this.passwordConfirmation = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
