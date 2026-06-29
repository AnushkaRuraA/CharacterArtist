import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { AdminUser } from '../modules/auth/auth.model.js';

export const protect = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ') &&
      req.headers.authorization.split(' ')[1]);

  if (!token) throw new ApiError(401, 'Not authenticated');

  const decoded = jwt.verify(token, env.JWT_SECRET);
  const user = await AdminUser.findById(decoded.id).select('-password');
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
};
