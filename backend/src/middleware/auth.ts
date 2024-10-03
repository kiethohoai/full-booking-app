import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const vertifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.cookies['auth_token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decode as JwtPayload)._id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default vertifyToken;
