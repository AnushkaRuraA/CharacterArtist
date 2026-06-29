import mongoose from 'mongoose';

const processSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc:  { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProcessStep = mongoose.model('ProcessStep', processSchema);
