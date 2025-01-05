// src/models/Location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  timestamp: { type: Date, default: Date.now },
  deviceInfo: {
    userAgent: String,
    ip: String
  },
  accuracy: Number,
  speed: Number
});


export const Location = mongoose.model('Location', locationSchema);