const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const QRCode = require('qrcode');
const Url = require('../models/Url');

// สร้าง Short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // ตรวจสอบว่ามี URL นี้อยู่แล้วหรือไม่
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json(url);
    }

    // สร้าง short code
    const shortCode = shortid.generate();
    const baseUrl = process.env.BASE_URL || 'https://shortrul-synerry.onrender.com';
    const shortUrl = `${baseUrl}/s/${shortCode}`;

    // สร้าง QR Code
    const qrCode = await QRCode.toDataURL(shortUrl);

    // บันทึกลงฐานข้อมูล
    url = new Url({
      originalUrl,
      shortCode,
      shortUrl,
      qrCode
    });

    await url.save();
    res.json(url);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ดึงรายการ URL ทั้งหมด
router.get('/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ดึงข้อมูลสถิติ
router.get('/stats', async (req, res) => {
  try {
    const totalUrls = await Url.countDocuments();
    const totalClicks = await Url.aggregate([
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);
    
    const mostClicked = await Url.find().sort({ clicks: -1 }).limit(5);

    res.json({
      totalUrls,
      totalClicks: totalClicks[0]?.total || 0,
      mostClicked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ลบ URL
router.delete('/urls/:id', async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;