// src/config/socketConfig.js
import { Server } from 'socket.io';
import { Location } from '../models/Location.js';
import jwt from 'jsonwebtoken';

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('location-update', async (data) => {
      try {
        const location = new Location({
          userId: data.userId,
          coordinates: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude]
          }
        });
        await location.save();
        console.log('Location saved:', location);
      } catch (error) {
        console.error('Location update error:', error);
      }
    });
  });

  return io;
};