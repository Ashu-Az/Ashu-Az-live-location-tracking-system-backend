import { Server } from 'socket.io';
import { User } from '../models/User.js';
import { Location } from '../models/Location.js';
import jwt from 'jsonwebtoken';

export class SocketService {
 constructor(server) {
   this.io = new Server(server, {
     cors: { 
       origin: "*",
       methods: ["GET", "POST"],
       credentials: true
     }
   });

   this.io.use(async (socket, next) => {
     try {
       const token = socket.handshake.auth.token;
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       socket.userId = decoded.userId;
       next();
     } catch (err) {
       next(new Error('Authentication failed'));
     }
   });

   this.io.on('connection', socket => {
    socket.on('location-update', async data => {
      try {
        // Save location
        const location = await Location.create({
          userId: socket.userId,
          coordinates: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude]
          }
        });
  
        // Update user's last location
        await User.findByIdAndUpdate(socket.userId, {
          lastLocation: {
            coordinates: [data.longitude, data.latitude],
            timestamp: new Date()
          }
        });
  
        this.io.emit('location-updated', {
          userId: socket.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Location update error:', error);
      }
    });
  });
 }

 async updateUserLocation(userId, data) {
   const locationData = {
     userId,
     coordinates: {
       type: 'Point',
       coordinates: [data.longitude, data.latitude]
     },
     timestamp: new Date()
   };

   const location = await Location.create(locationData);

   await User.findByIdAndUpdate(userId, {
     'lastLocation.coordinates': [data.longitude, data.latitude],
     'lastLocation.timestamp': new Date()
   });

   this.io.emit('location-updated', {
     userId,
     ...data,
     timestamp: new Date()
   });

   return location;
 }
}
