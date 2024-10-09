import express, { Request, Response } from 'express';
import Hotel from '../models/hotelModel';
import { HotelSearchRespone } from '../shared/types';
import { param, validationResult } from 'express-validator';

const router = express.Router();

// todo Get Single Hotel api/hotels/:id
router.get(
  '/:id',
  [param('id').notEmpty().withMessage('Hotel ID is required')],
  async (req: Request, res: Response): Promise<any> => {
    // Check err from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.status(200).json(hotel);
    } catch (error) {
      console.log(`🚀Error on get single hotel =>`, error);
      res.status(500).json({ message: 'Error fetching hotels' });
    }
  },
);

router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOptions) {
      case 'starRating':
        sortOptions = { starRating: -1 };
        break;
      case 'pricePerNightAsc':
        sortOptions = { pricePerNight: 1 };
        break;
      case 'pricePerNightDesc':
        sortOptions = { pricePerNight: -1 };
        break;
      default:
        sortOptions = { lastUpdated: -1 };
    }

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');

    // skip documents
    const skip = (pageNumber - 1) * pageSize;
    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    const total = await Hotel.countDocuments(query);

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
    res.status(500).json({ message: 'Something went wrong' });
  }
});

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, 'i') },
      { country: new RegExp(queryParams.destination, 'i') },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
