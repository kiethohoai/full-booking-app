import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
const morgan = require('morgan');
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRotes';
import hotelRoutes from './routes/hotelRoutes';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 7001;

app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('🚀DB Connected');
  console.log('🚀ENV', process.env.NODE_ENV);
});

// Middlewares secury
app.use(
  cors({
    origin: process.env.FONTEND_URL as string,
    credentials: true,
  }),
);

// todo Connect to FE
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan Logger
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/my-hotels', hotelRoutes);

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀Server is running on port ${PORT}`);
});
