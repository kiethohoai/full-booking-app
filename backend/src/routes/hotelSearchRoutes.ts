import express, { Request, Response } from 'express';
import Hotel from '../models/hotelModel';
import { HotelSearchRespone } from '../shared/types';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : '1',
    );

    // skip documents
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find().skip(skip).limit(pageSize);
    const total = await Hotel.countDocuments();

    const respone: HotelSearchRespone = {
      data: hotels,
      pagination: {
        total: total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(respone);
  } catch (error) {
    console.log(`🚀  error =>`, error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
