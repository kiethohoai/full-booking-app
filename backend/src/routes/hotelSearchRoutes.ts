import express, { Request, Response } from 'express';
import Hotel from '../models/hotelModel';
import { BookingType, HotelSearchRespone } from '../shared/types';
import { param, validationResult } from 'express-validator';
import Stripe from 'stripe';
import vertifyToken from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();

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
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : '1',
    );

    // skip documents
    const skip = (pageNumber - 1) * pageSize;
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
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

// todo Payment Intent
router.post(
  '/:hotelId/bookings/payment-intent',
  vertifyToken,
  async (req: Request, res: Response): Promise<any> => {
    //totalCost & hotelId & userId
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const totalCost = hotel.pricePerNight * numberOfNights;

    //paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: 'usd',
      metadata: {
        hotelId,
        userId: req.userId,
      },
    });

    // Check if fail
    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: 'Fail to create payment-intent' });
    }

    // If OK, create output
    const respone = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost: totalCost,
    };

    // Send output
    res.send(respone);

    try {
    } catch (error) {
      console.log(`🚀Error on create payment-intent route: =>`, error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

// todo POST Hotel Booking
router.post(
  '/:hotelId/bookings',
  vertifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string,
      );

      if (!paymentIntent) {
        return res.status(404).json({ message: 'Payment intent not found' });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: 'Invalid payment intent' });
      }

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
        },
        {
          $push: {
            bookings: newBooking,
          },
        },
        {
          new: true,
        },
      );

      if (!hotel) {
        return res.status(400).json({ message: 'Hotel not found' });
      }

      await hotel.save();
      res.status(200).send();
    } catch (error) {
      console.log(`🚀Error at Hotel Booking Route =>`, error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

// todo constructSearchQuery
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
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
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

// todo Get Single Hotel (Detail Hotel)
router.get(
  '/:id',
  [param('id').notEmpty().withMessage('Hotel ID is required')],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      const id = req.params.id.toString();
      const hotel = await Hotel.findById(id);
      res.status(200).json(hotel);
    } catch (error) {
      console.log(`🚀Error getting a hotel =>`, error);
      res.status(500).json({ message: 'Error fetching a hotel!' });
    }
  },
);

// export router
export default router;
