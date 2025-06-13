const Blog = require('../models/Blog');
const calculateReadingTime = require('../utils/calculateReadingTime');

// Create a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(401).json({ message: 'Title and body are required' });
    }

    // Optional: trim to avoid whitespace-only input
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      return res.status(400).json({ message: 'Title and body cannot be empty' });
    }

    // Check for duplicate title
    const existing = await Blog.findOne({ title: trimmedTitle });
    if (existing) return res.status(400).json({ message: 'Title already used' });

    const reading_time = calculateReadingTime(trimmedBody);

    const blog = await Blog.create({
      title: trimmedTitle,
      description,
      tags,
      body: trimmedBody,
      author: req.user._id,
      reading_time,
    });

    res.status(201).json({
      message: 'Blog created in draft state',
      blog,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs?search=&author=&tags=&sortBy=&page=&limit=
exports.getPublishedBlogs = async (req, res) => {
  try {
    const {
      author,
      title,
      tags,
      sortBy = 'timestamp',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { state: 'published' };

    if (author) query.author = author;
    if (title) query.title = new RegExp(title, 'i');
    if (tags) query.tags = { $in: tags.split(',') };

    const sortOptions = {};
    if (['read_count', 'reading_time', 'timestamp'].includes(sortBy)) {
      sortOptions[sortBy] = -1;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ page, count: blogs.length, blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/user
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ message: 'Not authorized' });

    const fields = ['title', 'body', 'tags', 'description'];
    fields.forEach(f => {
      if (req.body[f]) blog[f] = req.body[f];
    });

    blog.reading_time = calculateReadingTime(blog.body);
    await blog.save();

    res.json({ message: 'Blog updated', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ message: 'Not authorized' });

    blog.state = 'published';
    await blog.save();

    res.json({ message: 'Blog published', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ message: 'Not authorized' });

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/:id - Get a single published blog and increment read_count
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, state: 'published' })
      .populate('author', 'first_name last_name email');

    if (!blog) return res.status(404).json({ message: 'Blog not found or not published' });

    blog.read_count += 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

