import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `portfolio/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

export const uploadPortfolio = multer({
  storage: makeStorage('works'),
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('images', 10);

export const uploadSingle = (folder) =>
  multer({
    storage: makeStorage(folder),
    limits: { fileSize: 10 * 1024 * 1024 },
  }).single('image');
