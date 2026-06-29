import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as svc from './skills.service.js';

export const getAll = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await svc.getAll()));
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json(new ApiResponse(201, await svc.create(req.body), 'Skill created'));
});

export const update = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await svc.update(req.params.id, req.body), 'Skill updated'));
});

export const remove = asyncHandler(async (req, res) => {
  await svc.remove(req.params.id);
  res.json(new ApiResponse(200, null, 'Skill deleted'));
});

export const reorder = asyncHandler(async (req, res) => {
  await svc.reorder(req.body.items);
  res.json(new ApiResponse(200, null, 'Reordered'));
});
