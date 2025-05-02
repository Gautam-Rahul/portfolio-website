import Resume from '../models/Resume.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resumeDir = path.join(__dirname, '..', 'uploads', 'resume');

// Upload a new resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if a resume already exists, and deactivate it
    const existingResume = await Resume.findOne({ isActive: true });
    
    if (existingResume) {
      existingResume.isActive = false;
      await existingResume.save();
      
      // Optionally delete old file to save space
      // const oldPath = path.join(__dirname, '..', existingResume.path);
      // if (fs.existsSync(oldPath)) {
      //   fs.unlinkSync(oldPath);
      // }
    }

    // Create new resume record
    const resume = await Resume.create({
      filename: req.file.originalname,
      path: `/uploads/resume/${req.file.filename}`,
      isActive: true
    });

    res.status(201).json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get active resume
export const getActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found'
      });
    }
    
    res.status(200).json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all resumes
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });
  } catch (error) {
    console.error('Get all resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Activate a specific resume
export const activateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    
    // Find the resume to activate
    const resumeToActivate = await Resume.findById(resumeId);
    
    if (!resumeToActivate) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    // Deactivate all resumes
    await Resume.updateMany({}, { isActive: false });
    
    // Activate the selected resume
    resumeToActivate.isActive = true;
    await resumeToActivate.save();
    
    res.status(200).json({
      success: true,
      resume: resumeToActivate
    });
  } catch (error) {
    console.error('Activate resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    // Check if it's the active resume
    if (resume.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the active resume. Activate another resume first.'
      });
    }
    
    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', resume.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await Resume.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 