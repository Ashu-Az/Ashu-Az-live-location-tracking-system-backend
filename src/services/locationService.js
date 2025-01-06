// src/services/locationService.js
import { Location } from '../models/Location.js';

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
   const activeTime = new Date(Date.now() - 5 * 60 * 1000); // Last 5 minutes
   const activeLocations = await Location.find({
     timestamp: { $gte: activeTime }
   })
   .distinct('userId');
   
   return activeLocations;
 }
}