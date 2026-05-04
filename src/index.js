import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dbConnect from './config/db.js';
import rootRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Server } from 'socket.io';
import http from 'http';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// cors port
app.use(cors({
  origin: ['http://localhost:4000', 'http://localhost:3000'],
  credentials: true
}))

// server scoket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
})

const allCustomers = [];
const allSeller = []
const addUser = (customerId, socketId, userInfo) => {
  const checkUser = allCustomers.some(c => c.customerId === customerId);
  if (!checkUser) {
    allCustomers.push({
      customerId,
      socketId,
      userInfo
    })
  }
}

const addSeller = (sellerId, socketId, userInfo) => {
  const checkSeller = allSeller.some(c => c.sellerId === sellerId);
  if (!checkSeller) {
    allSeller.push({
      sellerId,
      socketId,
      userInfo
    })
  }
}

io.on('connection', (socket) => {
  socket.on('add_user', (customerId, userInfo) => {
    addUser(customerId, socket.id, userInfo);
  })
  socket.on('add_seller', (sellerId, userInfo) => {
    addSeller(sellerId, socket.id, userInfo)
  })
  console.log('socket connected')
})
// convert json
app.use(express.json());
// cookie-parser
app.use(cookieParser());
//connect database
dbConnect();
// router api
app.use('/api', rootRouter);
// middleware error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})