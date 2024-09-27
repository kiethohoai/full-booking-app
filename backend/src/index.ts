import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test', async (req: Request, res: Response) => {
  res.json({ message: 'Hello From Expres Endpoint!' });
});

app.listen(7000, () => {
  console.log('🚀Server is running on port 7000');
  console.warn(`🚀  7000 =>`, 7000);
});
