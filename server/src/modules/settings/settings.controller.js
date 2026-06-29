import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { getSettings, updateSettings } from './settings.service.js';

export const get = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await getSettings()));
});

export const update = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await updateSettings(req.body), 'Settings updated'));
});
