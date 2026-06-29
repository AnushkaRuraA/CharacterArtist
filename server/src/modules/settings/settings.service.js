import { Settings } from './settings.model.js';

export const getSettings = async () => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
};

export const updateSettings = async (data) => {
  let s = await Settings.findOne();
  if (!s) s = new Settings();
  Object.assign(s, data);
  return s.save();
};
