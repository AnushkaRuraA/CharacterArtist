import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    bio: { type: String, default: '' },
    portrait: { url: String, publicId: String },
    skillTags: [{ type: String }],
    yearsExperience: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    clientsServed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const About = mongoose.model('About', aboutSchema);
