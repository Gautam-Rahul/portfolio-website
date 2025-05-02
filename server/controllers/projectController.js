import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads', 'projects');

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, liveLink, repoLink, technologies, featured, order } = req.body;
    
    // Get image path from multer upload or use placeholder
    const imageUrl = req.file 
      ? `/uploads/projects/${req.file.filename}` 
      : `https://picsum.photos/seed/${Date.now()}/800/600`;
    
    // Parse technologies if it's a string
    const techArray = typeof technologies === 'string' 
      ? JSON.parse(technologies) 
      : (technologies || []);
    
    const project = await Project.create({
      title,
      description,
      imageUrl,
      liveLink,
      repoLink,
      technologies: techArray,
      featured: featured === 'true',
      order: order ? Number(order) : 0
    });
    
    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, featured: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get a single project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const { title, description, liveLink, repoLink, technologies, featured, order } = req.body;
    
    // Parse technologies if it's a string
    let techArray = project.technologies;
    if (technologies) {
      techArray = typeof technologies === 'string' 
        ? JSON.parse(technologies) 
        : technologies;
    }
    
    // Handle image update
    let imageUrl = project.imageUrl;
    if (req.file) {
      // Delete old image if it exists and is not a placeholder
      if (project.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', project.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/projects/${req.file.filename}`;
    }
    
    // Update project
    project = await Project.findByIdAndUpdate(req.params.id, {
      title: title || project.title,
      description: description || project.description,
      imageUrl,
      liveLink: liveLink !== undefined ? liveLink : project.liveLink,
      repoLink: repoLink !== undefined ? repoLink : project.repoLink,
      technologies: techArray,
      featured: featured !== undefined ? featured === 'true' : project.featured,
      order: order !== undefined ? Number(order) : project.order
    }, { new: true });
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete associated image if it's not a placeholder
    if (project.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', project.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 