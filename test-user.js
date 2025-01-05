// test-data.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import models with their schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
});

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const generateTestData = async () => {
  await connectDB();

  for(let i = 0; i < 20; i++) {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = await User.create({
      email: `user${i}@test.com`,
      password: hashedPassword,
      name: `Test User ${i}`
    });
    
    for(let j = 0; j < 10; j++) {
      await Location.create({
        userId: user._id,
        coordinates: {
          coordinates: [
            77.5946 + (Math.random() - 0.5) * 0.1,
            12.9716 + (Math.random() - 0.5) * 0.1
          ]
        },
        timestamp: new Date(Date.now() - j * 60000)
      });
    }
    console.log(`Created user ${i} with locations`);
  }
  
  console.log('Test data created');
  process.exit(0);
};

generateTestData().catch(console.error);