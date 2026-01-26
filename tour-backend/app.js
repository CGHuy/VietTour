const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database
const db = require('./src/config/database');

// Import models để test
const Tour = require('./src/models/Tour');
const User = require('./src/models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test database route
app.get('/api/test-db', async (req, res) => {
  try {
    const tours = await Tour.getAll();
    res.json({
      success: true,
      message: 'Kết nối database thành công!',
      data: tours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối database',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
});