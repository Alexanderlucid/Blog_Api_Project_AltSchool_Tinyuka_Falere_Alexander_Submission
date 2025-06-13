require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })

  .catch(err => console.error('MongoDB connection error:', err));

