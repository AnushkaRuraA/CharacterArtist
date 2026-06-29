import { Service } from './services.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAll = () => Service.find({ isVisible: true }).sort({ order: 1 });
export const getAllAdmin = () => Service.find().sort({ order: 1 });

export const create = (data) => Service.create(data);

export const update = async (id, data) => {
  const svc = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!svc) throw new ApiError(404, 'Service not found');
  return svc;
};

export const remove = async (id) => {
  const svc = await Service.findByIdAndDelete(id);
  if (!svc) throw new ApiError(404, 'Service not found');
};
