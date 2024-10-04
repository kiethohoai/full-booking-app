import express, { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import Hotel from '../models/hotelModel';
import vertifyToken from '../middleware/auth';
import { body } from 'express-validator';
import { HotelType } from '../shared/types';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});

// todo Create Hotel Endpoint
router.post(
  '/',
  vertifyToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('adultCount')
      .notEmpty()
      .isNumeric()
      .withMessage('Adult Count is required'),

    body('childCount')
      .notEmpty()
      .isNumeric()
      .withMessage('Child Count is required'),

    body('facilities')
      .notEmpty()
      .isArray()
      .withMessage('Facilities is required'),

    body('pricePerNight')
      .notEmpty()
      .isNumeric()
      .withMessage('PricePerNight is required and must be a number'),

    body('startRating')
      .notEmpty()
      .isNumeric()
      .withMessage('StartRating is required and must be a number'),
  ],
  upload.any(),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      console.log(`🚀  req.userId =>`, req.userId);

      // 1. Upload images to Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64');
        let dataURI = `data:${image.mimetype};base64,${b64}`;
        const res = await cloudinary.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // 2. If successful, add the URLs to the newHotel object
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // 3. Save the newHotel object to the database
      const hotel = new Hotel(newHotel);
      await hotel.save();

      // 4. Send a success response
      res.status(201).send(hotel);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

// todo Get All Hotels Endpoint
router.get('/', vertifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels' });
  }
});

// Export router
export default router;
