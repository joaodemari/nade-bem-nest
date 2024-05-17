import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../core/utils/dotenvConfig';

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  // Replace with your actual secret key
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  token = token!.replace('Bearer ', '');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Attach user information to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  });
}

export interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with the actual type of your user object
}
