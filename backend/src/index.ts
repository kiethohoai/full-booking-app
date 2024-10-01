import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
const morgan = require('morgan');
import cookieParser from 'cookie-parser';
import path from 'path';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRotes';

const app = express();
const PORT = process.env.PORT || 7001;

app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('🚀DB Connected');
  console.log('🚀ENV', process.env.NODE_ENV);
});

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Middlewares secury
app.use(
  cors({
    origin: process.env.FONTEND_URL as string,
    credentials: true,
  }),
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan Logger
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀Server is running on port ${PORT}`);
});
