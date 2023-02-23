const Mongoose = require('mongoose');

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "customer",
    enum: ["customer", "admin"],
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('User', UserSchema);
