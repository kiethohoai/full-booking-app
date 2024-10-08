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

    body('starRating')
      .notEmpty()
      .isNumeric()
      .withMessage('StarRating is required and must be a number'),
  ],
  upload.any(),
  // upload.array('imageFiles', 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      console.log(`🚀  req.userId =>`, req.userId);

      // 1. Upload images to Cloudinary
      const imageUrls = await uploadImages(imageFiles);

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

// todo Get Single Hotel (Detail Hotel)
router.get('/:id', vertifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// todo Update Hotel Endpoint
router.put(
  '/:hotelId',
  vertifyToken,
  upload.any(),
  // upload.array('imageFiles', 6),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const updateHotel: HotelType = req.body;
      updateHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updateHotel,
        { new: true },
      );

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      const files = req.files as Express.Multer.File[];
      const updateImageUrls = await uploadImages(files);
      hotel.imageUrls = [...updateImageUrls, ...(hotel.imageUrls || [])];
      await hotel.save();

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

// Export router
export default router;

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    let dataURI = `data:${image.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
