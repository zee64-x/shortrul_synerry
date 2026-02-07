require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urls');
const Url = require('./models/Url');

const app = express();

// เชื่อมต่อฐานข้อมูล
connectDB();

// Middleware - แก้ตรงนี้
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:5173',
    'https://shortrul-synerry.vercel.app'  // เพิ่มบรรทัดนี้
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', urlRoutes);

// Redirect route สำหรับ short URL
app.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (url) {
      // เพิ่มจำนวนคลิก
      url.clicks++;
      url.lastAccessed = new Date();
      await url.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;