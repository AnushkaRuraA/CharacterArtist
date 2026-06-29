import cloudinary from '../../config/cloudinary.js';
import { About } from './about.model.js';

export const getAbout = async () => {
  let about = await About.findOne();
  if (!about) about = await About.create({});
  return about;
};

export const updateAbout = async (data, file) => {
  let about = await About.findOne();
  if (!about) about = new About();

  if (data.skillTags && typeof data.skillTags === 'string') {
    data.skillTags = data.skillTags.split(',').map((s) => s.trim()).filter(Boolean);
  }

  Object.assign(about, data);

  if (file) {
    if (about.portrait?.publicId) {
      await cloudinary.uploader.destroy(about.portrait.publicId);
    }
    about.portrait = { url: file.path, publicId: file.filename };
  }

  return about.save();
};
