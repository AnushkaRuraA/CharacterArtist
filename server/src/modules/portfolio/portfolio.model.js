import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    category: {
      type: String,
      enum: ['characters', 'creatures', 'environments', 'concepts', 'fanart', 'game-ready'],
      required: true,
    },
    description: { type: String, default: '' },
    images: [imageSchema],
    modelEmbedUrl: { type: String, default: '' },
    tags: [{ type: String }],
    software: [{ type: String }],
    year: { type: Number },
    polyCount: { type: String, default: '' },
    engine: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

portfolioSchema.index({ category: 1 });
portfolioSchema.index({ isFeatured: 1 });
portfolioSchema.index({ isPublished: 1 });

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
