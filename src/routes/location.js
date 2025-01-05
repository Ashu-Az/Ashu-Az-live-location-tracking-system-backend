// src/routes/location.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { Location } from '../models/Location.js';

const router = express.Router();

router.get('/history/:userId', auth, async (req, res) => {
  try {
    const locations = await Location.find({ userId: req.params.userId })
      .sort({ timestamp: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const location = new Location({
      userId: req.user.userId,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });
    await location.save();
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;