import { Skill } from './skills.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAll = () => Skill.find().sort({ order: 1, createdAt: 1 });

export const create = (data) => Skill.create(data);

export const update = async (id, data) => {
  const skill = await Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!skill) throw new ApiError(404, 'Skill not found');
  return skill;
};

export const remove = async (id) => {
  const skill = await Skill.findByIdAndDelete(id);
  if (!skill) throw new ApiError(404, 'Skill not found');
};

export const reorder = async (items) => {
  const ops = items.map(({ id, order }) => ({
    updateOne: { filter: { _id: id }, update: { order } },
  }));
  await Skill.bulkWrite(ops);
};
