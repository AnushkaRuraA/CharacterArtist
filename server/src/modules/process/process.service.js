import { ProcessStep } from './process.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAll = () => ProcessStep.find().sort({ order: 1, createdAt: 1 });

export const create = (data) => ProcessStep.create(data);

export const update = async (id, data) => {
  const step = await ProcessStep.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!step) throw new ApiError(404, 'Process step not found');
  return step;
};

export const remove = async (id) => {
  const step = await ProcessStep.findByIdAndDelete(id);
  if (!step) throw new ApiError(404, 'Process step not found');
};

export const reorder = async (items) => {
  const ops = items.map(({ id, order }) => ({
    updateOne: { filter: { _id: id }, update: { order } },
  }));
  await ProcessStep.bulkWrite(ops);
};
