import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 7001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('🚀DB Connected');
  console.log('🚀ENV', process.env.NODE_ENV);

});

// Middlewares secury
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', async (req: Request, res: Response) => {
  res.json({ message: 'Hello From Expres Endpoint!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀Server is running on port ${PORT}`);
});
