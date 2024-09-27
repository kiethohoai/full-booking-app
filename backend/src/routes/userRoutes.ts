import express, { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/register',
  [
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
    check('firstName', 'Please Enter Your First Name').not().isEmpty(),
    check('lastName', 'Please Enter Your Last Name').not().isEmpty(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      // Check User Exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: 'User Already Exist' });
      }

      // Hash Password => Using MongDB Middleware

      // Create User & Save User
      user = new User(req.body);
      await user.save();

      // Create JWT Token
      const token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1day' },
      );

      // Send JWT Token via Cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== 'development',
      });

      // Send Back Response
      res.status(200).json({ message: 'User Created' });

      // Catch Errors
    } catch (error) {
      console.log(`🚀error on /register =>`, error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

export default router;
