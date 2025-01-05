import { Location } from '../models/Location.js';
import redis from '../config/redis.js';

export class LocationService {
  static async updateLocation(userId, latitude, longitude) {
    const location = new Location({
      userId,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });

    await location.save();
    return location;
  }

  static async getRecentLocations(userId) {
    const cachedLocation = await redis.get(`location:${userId}`);
    if (cachedLocation) {
      return JSON.parse(cachedLocation);
    }

    const location = await Location.findOne({ userId })
      .sort({ timestamp: -1 });
    return location;
  }

  static async getUserHistory(userId, startDate, endDate, limit = 100) {
    return Location.find({
      userId,
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ timestamp: -1 })
    .limit(limit);
  }

  static async getActiveUsers() {
    const keys = await redis.keys('location:*');
    const activeUsers = [];
    
    for (const key of keys) {
      const userId = key.split(':')[1];
      const locationData = await redis.get(key);
      if (locationData) {
        activeUsers.push({
          userId,
          ...JSON.parse(locationData)
        });
      }
    }
    
    return activeUsers;
  }
}
