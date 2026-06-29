import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    type: { type: String, enum: ['quick', 'project'], default: 'quick' },
    projectType: { type: String, default: '' },
    budget: { type: String, default: '' },
    deadline: { type: String, default: '' },
    referenceLinks: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model('ContactMessage', contactSchema);
