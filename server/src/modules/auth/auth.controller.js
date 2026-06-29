import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { loginUser, getMe } from './auth.service.js';
import { env } from '../../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await loginUser(req.body);
  res.cookie('token', token, cookieOptions);
  res.json(new ApiResponse(200, { token, user }, 'Login successful'));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const me = asyncHandler(async (req, res) => {
  const user = await getMe(req.user._id);
  res.json(new ApiResponse(200, user, 'User fetched'));
});
