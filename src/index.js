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

let allCustomers = [];
let allSeller = []
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

const findCustomer = (customerId) => {
  return allCustomers.find(c => c.customerId === customerId);
}

const findSeller = (sellerId) => {
  return allSeller.find(c => c.sellerId === sellerId);
}

const remove = (socketId) => {
  allCustomers = allCustomers.filter(c => c.socketId !== socketId);
}
const removeSeller = (socketId) => {
  const index = allSeller.findIndex(s => s.socketId === socketId);
  if (index !== -1) {
    allSeller.splice(index, 1);
  }
};

io.on('connection', (socket) => {
  socket.on('add_user', (customerId, userInfo) => {
    addUser(customerId, socket.id, userInfo);
    io.emit('activeCustomer', allCustomers)
  })
  socket.on('add_seller', (sellerId, userInfo) => {
    addSeller(sellerId, socket.id, userInfo)
    io.emit('activeSeller', allSeller)
  })
  socket.on('send_message', (msg) => {
    console.log(msg)
    const customer = findCustomer(msg.receiverId);
    if (customer !== undefined) {
      socket.to(customer.socketId).emit('receive_message', msg);
    }
  })
  socket.on('request_active', () => {
    socket.emit('activeCustomer', allCustomers);
    socket.emit('activeSeller', allSeller);
  });

  socket.on('send_customer_message', (msg) => {
    const seller = findSeller(msg.receiverId);
    console.log(seller)
    if (seller !== undefined) {
      socket.to(seller.socketId).emit('customer_message', msg);
    }
  })

  socket.on('disconnect', () => {
    console.log('socket disconnected')
    remove(socket.id);
    removeSeller(socket.id);
    io.emit('activeCustomer', allCustomers);
    io.emit('activeSeller', allSeller);
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