// src/controllers/adminController.js
import { User } from '../models/User.js';
import { Location } from '../models/Location.js';
import { LocationService } from '../services/locationService.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'locations',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] }
              }
            },
            { $sort: { timestamp: -1 } },
            { $limit: 1 }
          ],
          as: 'lastLocation'
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          lastLocation: { $arrayElemAt: ['$lastLocation', 0] }
        }
      }
    ]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserLocationHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const locations = await Location.find({
      userId,
      timestamp: {
        $gte: new Date(startDate || Date.now() - 24*60*60*1000),
        $lte: new Date(endDate || Date.now())
      }
    }).sort({ timestamp: -1 });
    
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeLocations = await Location.find({
      timestamp: { $gte: fiveMinutesAgo }
    }).distinct('userId');
    
    const activeUsers = await User.find({
      _id: { $in: activeLocations }
    }, '-password');
    
    res.json(activeUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportUserLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    const locations = await Location.find({ userId })
      .sort({ timestamp: -1 })
      .limit(1000);
    
    const locationData = locations.map(loc => ({
      timestamp: loc.timestamp,
      latitude: loc.coordinates.coordinates[1],
      longitude: loc.coordinates.coordinates[0]
    }));
    
    res.json(locationData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

