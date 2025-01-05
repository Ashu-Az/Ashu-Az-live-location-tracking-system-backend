// test/load-test.js
import { io } from 'socket.io-client';

const NUM_USERS = 500;// Start with fewer users for testing
const INTERVAL = 4000;

async function simulateUsers() {
  console.log('Starting load test...');
  
  for(let i = 0; i < NUM_USERS; i++) {
    const socket = io('http://localhost:3000');
    
    socket.on('connect', () => console.log(`User ${i} connected`));
    socket.on('connect_error', (error) => console.log(`User ${i} error:`, error));

    socket.emit('location-update', {
      latitude: 12.9716,
      longitude: 77.5946
    });

    console.log(`User ${i} initialized`);
  }
}

simulateUsers();