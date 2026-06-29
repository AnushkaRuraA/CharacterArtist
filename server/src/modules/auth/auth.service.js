import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from './auth.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { env } from '../../config/env.js';

export const loginUser = async ({ email, password }) => {
  const user = await AdminUser.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return { token, user: { id: user._id, email: user.email } };
};

export const getMe = async (userId) => {
  const user = await AdminUser.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
