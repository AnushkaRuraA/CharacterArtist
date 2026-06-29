import cloudinary from '../../config/cloudinary.js';
import { Hero } from './hero.model.js';

export const getHero = async () => {
  let hero = await Hero.findOne();
  if (!hero) hero = await Hero.create({});
  return hero;
};

export const updateHero = async (data, file) => {
  let hero = await Hero.findOne();
  if (!hero) hero = new Hero();

  Object.assign(hero, data);

  if (file) {
    if (hero.backgroundImage?.publicId) {
      await cloudinary.uploader.destroy(hero.backgroundImage.publicId);
    }
    hero.backgroundImage = { url: file.path, publicId: file.filename };
  }

  return hero.save();
};
