import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume; 