import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as svc from './contact.service.js';

export const submit = asyncHandler(async (req, res) => {
  const msg = await svc.submitContact(req.body);
  res.status(201).json(new ApiResponse(201, msg, 'Message sent successfully'));
});

export const getMessages = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await svc.getMessages(req.query)));
});

export const markRead = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, await svc.markRead(req.params.id), 'Marked as read'));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await svc.deleteMessage(req.params.id);
  res.json(new ApiResponse(200, null, 'Message deleted'));
});
