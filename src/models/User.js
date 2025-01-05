// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
 email: {
   type: String,
   required: true,
   unique: true
 },
 name: {
   type: String,
   required: true
 },
 password: {
   type: String,
   required: true
 },
 isAdmin: {
   type: Boolean,
   default: false
 },
 lastLocation: {
  coordinates: {
    type: [Number],
    default: [0, 0]
  },
  timestamp: Date
}
});

userSchema.pre('save', async function(next) {
 if (this.isModified('password')) {
   this.password = await bcrypt.hash(this.password, 10);
 }
 next();
});

export const User = mongoose.model('User', userSchema);