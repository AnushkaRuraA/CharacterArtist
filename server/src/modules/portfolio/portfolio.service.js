import slugify from 'slugify';
import cloudinary from '../../config/cloudinary.js';
import { Portfolio } from './portfolio.model.js';
import { ApiError } from '../../utils/ApiError.js';

const makeSlug = async (title, existingId = null) => {
  let slug = slugify(title, { lower: true, strict: true });
  const query = { slug };
  if (existingId) query._id = { $ne: existingId };
  const exists = await Portfolio.findOne(query);
  if (exists) slug = `${slug}-${Date.now()}`;
  return slug;
};

const normalizeArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map((s) => s.trim()).filter(Boolean);
};

export const getAllPortfolio = async ({ category, featured, page = 1, limit = 20 } = {}) => {
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (featured !== undefined) filter.isFeatured = featured === 'true';

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Portfolio.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    Portfolio.countDocuments(filter),
  ]);
  return { items, total, page: Number(page), limit: Number(limit) };
};

export const getAllPortfolioAdmin = async () =>
  Portfolio.find().sort({ order: 1, createdAt: -1 });

export const getPortfolioBySlug = async (slug) => {
  const item = await Portfolio.findOne({ slug, isPublished: true });
  if (!item) throw new ApiError(404, 'Portfolio item not found');
  return item;
};

export const createPortfolio = async (data, files = []) => {
  data.tags = normalizeArray(data.tags);
  data.software = normalizeArray(data.software);
  data.slug = await makeSlug(data.title);

  const images = files.map((f, i) => ({
    url: f.path,
    publicId: f.filename,
    isPrimary: i === 0,
    order: i,
  }));

  return Portfolio.create({ ...data, images });
};

export const updatePortfolio = async (id, data, files = []) => {
  const item = await Portfolio.findById(id);
  if (!item) throw new ApiError(404, 'Portfolio item not found');

  if (data.title && data.title !== item.title) {
    data.slug = await makeSlug(data.title, id);
  }
  if (data.tags) data.tags = normalizeArray(data.tags);
  if (data.software) data.software = normalizeArray(data.software);

  if (files.length > 0) {
    const newImages = files.map((f, i) => ({
      url: f.path,
      publicId: f.filename,
      isPrimary: item.images.length === 0 && i === 0,
      order: item.images.length + i,
    }));
    data.images = [...item.images, ...newImages];
  }

  return Portfolio.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deletePortfolio = async (id) => {
  const item = await Portfolio.findById(id);
  if (!item) throw new ApiError(404, 'Portfolio item not found');

  for (const img of item.images) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }

  await item.deleteOne();
};

export const reorderPortfolio = async (items) => {
  const ops = items.map(({ id, order }) => ({
    updateOne: { filter: { _id: id }, update: { order } },
  }));
  await Portfolio.bulkWrite(ops);
};

export const removeImage = async (portfolioId, publicId) => {
  await cloudinary.uploader.destroy(publicId);
  await Portfolio.findByIdAndUpdate(portfolioId, {
    $pull: { images: { publicId } },
  });
};
