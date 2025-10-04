import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dbConnect from './config/db.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// cors port
app.use(cors({
  origin: ['http://localhost:5174'],
  credentials: true
}))
// convert json
app.use(express.json());
// cookie-parser
app.use(cookieParser());
//connect database
dbConnect();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})