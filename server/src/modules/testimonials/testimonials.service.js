import cloudinary from '../../config/cloudinary.js';
import { Testimonial } from './testimonials.model.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAll = () => Testimonial.find().sort({ order: 1, createdAt: -1 });

export const create = async (data, file) => {
  if (file) data.avatar = { url: file.path, publicId: file.filename };
  return Testimonial.create(data);
};

export const update = async (id, data, file) => {
  const t = await Testimonial.findById(id);
  if (!t) throw new ApiError(404, 'Testimonial not found');
  if (file) {
    if (t.avatar?.publicId) await cloudinary.uploader.destroy(t.avatar.publicId);
    data.avatar = { url: file.path, publicId: file.filename };
  }
  return Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const remove = async (id) => {
  const t = await Testimonial.findById(id);
  if (!t) throw new ApiError(404, 'Testimonial not found');
  if (t.avatar?.publicId) await cloudinary.uploader.destroy(t.avatar.publicId);
  await t.deleteOne();
};
