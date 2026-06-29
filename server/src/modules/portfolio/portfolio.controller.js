import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as svc from './portfolio.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const data = await svc.getAllPortfolio(req.query);
  res.json(new ApiResponse(200, data));
});

export const getAllAdmin = asyncHandler(async (req, res) => {
  const data = await svc.getAllPortfolioAdmin();
  res.json(new ApiResponse(200, data));
});

export const getBySlug = asyncHandler(async (req, res) => {
  const data = await svc.getPortfolioBySlug(req.params.slug);
  res.json(new ApiResponse(200, data));
});

export const create = asyncHandler(async (req, res) => {
  const data = await svc.createPortfolio(req.body, req.files || []);
  res.status(201).json(new ApiResponse(201, data, 'Portfolio item created'));
});

export const update = asyncHandler(async (req, res) => {
  const data = await svc.updatePortfolio(req.params.id, req.body, req.files || []);
  res.json(new ApiResponse(200, data, 'Portfolio item updated'));
});

export const remove = asyncHandler(async (req, res) => {
  await svc.deletePortfolio(req.params.id);
  res.json(new ApiResponse(200, null, 'Portfolio item deleted'));
});

export const reorder = asyncHandler(async (req, res) => {
  await svc.reorderPortfolio(req.body.items);
  res.json(new ApiResponse(200, null, 'Reordered successfully'));
});

export const deleteImage = asyncHandler(async (req, res) => {
  await svc.removeImage(req.params.id, req.body.publicId);
  res.json(new ApiResponse(200, null, 'Image removed'));
});
