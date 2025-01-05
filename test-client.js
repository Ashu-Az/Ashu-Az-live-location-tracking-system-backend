import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});

// Simulate location updates every 4 seconds
setInterval(() => {
  socket.emit('location-update', {
    latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
    longitude: 77.5946 + (Math.random() - 0.5) * 0.01
  });
}, 4000);

