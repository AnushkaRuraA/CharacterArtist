import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { getAbout, updateAbout } from './about.service.js';

export const get = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await getAbout()));
});

export const update = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await updateAbout(req.body, req.file), 'About updated'));
});
