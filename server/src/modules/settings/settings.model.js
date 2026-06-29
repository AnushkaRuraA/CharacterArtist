import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    contactEmail: { type: String, default: '' },
    autoReplyBody: { type: String, default: 'Thank you for reaching out! I will get back to you within 24-48 hours.' },
    isAvailableForWork: { type: Boolean, default: true },
    seoTitle: { type: String, default: 'Portfolio — Character Artist' },
    seoDescription: { type: String, default: 'Character art, 3D sculpting, and concept design.' },
    ogImage: { type: String, default: '' },
    siteTagline: { type: String, default: 'Character Artist · Concept · 3D Sculpt' },
  },
  { timestamps: true }
);

export const Settings = mongoose.model('Settings', settingsSchema);
