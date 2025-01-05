import { io } from 'socket.io-client';

const adminSocket = io('http://localhost:3000', {
  auth: {
    token: 'admin_jwt_token'
  }
});

adminSocket.on('location-updated', (data) => {
  console.log('Location update:', data);
});