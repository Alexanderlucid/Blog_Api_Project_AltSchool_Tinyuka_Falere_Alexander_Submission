const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createBlog,
  getPublishedBlogs,
  getSingleBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  publishBlog
} = require('../controllers/blogController');

// Public routes
router.get('/', getPublishedBlogs);                               // All published blogs


// Authenticated user-only routes
router.post('/', authMiddleware, createBlog);                     // Create blog
router.get('/user', authMiddleware, getUserBlogs);                // Get user's blogs
router.get('/:id', getSingleBlog);                                // One published blog
router.put('/:id', authMiddleware, updateBlog);                   // Update blog
router.patch('/:id/publish', authMiddleware, publishBlog);        // Publish blog
router.delete('/:id', authMiddleware, deleteBlog);                // Delete blog

module.exports = router;
