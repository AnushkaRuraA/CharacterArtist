import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { getHero, updateHero } from './hero.service.js';

export const get = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await getHero()));
});

export const update = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await updateHero(req.body, req.file), 'Hero updated'));
});
