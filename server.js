require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size
  });
});

// Edit image with AI prompt
app.post('/api/edit', async (req, res) => {
  try {
    const { imagePath, prompt } = req.body;

    if (!imagePath || !prompt) {
      return res.status(400).json({ error: 'Image path and prompt are required' });
    }

    const fullPath = path.join(__dirname, imagePath);

    // Basic editing based on prompt keywords
    let image = sharp(fullPath);

    if (prompt.toLowerCase().includes('brightness') || prompt.toLowerCase().includes('яркость')) {
      image = image.modulate({ brightness: 1.2 });
    }
    if (prompt.toLowerCase().includes('contrast') || prompt.toLowerCase().includes('контраст')) {
      image = image.modulate({ saturation: 1.3 });
    }
    if (prompt.toLowerCase().includes('blur') || prompt.toLowerCase().includes('размыто')) {
      image = image.blur(3);
    }
    if (prompt.toLowerCase().includes('sharpen') || prompt.toLowerCase().includes('резкость')) {
      image = image.sharpen();
    }
    if (prompt.toLowerCase().includes('grayscale') || prompt.toLowerCase().includes('ч/б')) {
      image = image.grayscale();
    }
    if (prompt.toLowerCase().includes('sepia') || prompt.toLowerCase().includes('сепия')) {
      image = image.tint({ r: 112, g: 66, b: 20 });
    }

    const outputFilename = `edited_${Date.now()}.jpg`;
    const outputPath = path.join(__dirname, 'uploads', outputFilename);

    await image.toFile(outputPath);

    res.json({
      success: true,
      message: 'Image edited successfully',
      filename: outputFilename,
      path: `/uploads/${outputFilename}`
    });
  } catch (error) {
    console.error('Error editing image:', error);
    res.status(500).json({ error: 'Failed to edit image' });
  }
});

// Advanced AI edit using Replicate API
app.post('/api/ai-edit', async (req, res) => {
  try {
    const { imageUrl, prompt } = req.body;
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

    if (!REPLICATE_API_TOKEN) {
      return res.status(400).json({ 
        error: 'Replicate API token not configured. Set REPLICATE_API_TOKEN in .env' 
      });
    }

    // Using Replicate API for AI image editing
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'fce7b8395f5543119b747374f9b9f2d5d4481e55', // InstructPix2Pix model
        input: {
          image: imageUrl,
          prompt: prompt,
          scale: 7.5
        }
      },
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      predictionId: response.data.id,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error with AI edit:', error.message);
    res.status(500).json({ error: 'Failed to process AI edit' });
  }
});

// Check prediction status
app.get('/api/prediction/:id', async (req, res) => {
  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    const { id } = req.params;

    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${id}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prediction status' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
