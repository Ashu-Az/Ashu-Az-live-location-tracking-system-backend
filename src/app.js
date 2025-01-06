import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRouter from './routes/auth.js';
import locationRouter from './routes/location.js';
import adminRouter from './routes/admin.js';

dotenv.config();
const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  socket.token = token;
  next();
});

io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  
  socket.on('location-update', async data => {
    try {
      io.emit('location-updated', {
        ...data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Location update error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/auth', authRouter);
app.use('/location', locationRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();