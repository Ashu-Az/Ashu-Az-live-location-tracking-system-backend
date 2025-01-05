// src/controllers/locationController.js
import { Location } from '../models/Location.js';
import redis from '../config/redis.js';

export const updateLocation = async (req, res) => {
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
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 };
 
 export const getLocationHistory = async (req, res) => {
  try {
    const locations = await Location.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 };