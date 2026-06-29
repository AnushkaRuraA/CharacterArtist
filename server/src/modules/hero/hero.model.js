import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    artistName: { type: String, default: 'Your Name' },
    subtitle: { type: String, default: 'Character Artist · Concept · 3D Sculpt' },
    backgroundImage: { url: String, publicId: String },
    backgroundVideo: { type: String, default: '' },
    isVideoEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Hero = mongoose.model('Hero', heroSchema);
