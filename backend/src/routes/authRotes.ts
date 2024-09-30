import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/userModel';
import vertifyToken from '../middleware/auth';

const router = express.Router();

router.post(
  '/login',
  [
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('password', 'Password is Required').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User Does Not Exist' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '1day' },
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(200).json({
        userId: user._id,
        message: 'Login Successful',
      });

      // Error Handling
    } catch (error) {
      console.log(`🚀error at /login =>`, error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

router.get(
  '/validate-token',
  vertifyToken,
  async (req: Request, res: Response) => {
    res.status(200).json({
      userId: req.userId,
      message: 'Token Verified',
    });
  },
);

// todo logout
router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    expires: new Date(0),
  });

  res.status(200).json({
    message: 'Logout Successful',
  });
});

export default router;
