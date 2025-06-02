require('dotenv').config();
console.log('Using API Key:', process.env.LIGHTHOUSE_API_KEY);
const express = require('express');
const cors = require('cors');
const lighthouse = require('@lighthouse-web3/sdk');
const multer = require('multer');
const { Blob } = require('buffer');

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000'
}));
console.log('Node Env:', process.env.NODE_ENV);

app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// NFT Upload Endpoint
app.post('/api/upload-nft', upload.single('image'), async (req, res) => {
  try {
    console.log('Using API Key:', process.env.LIGHTHOUSE_API_KEY);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('Received file:', req.file.originalname);
    // 1. Upload Image
    const imageResponse = await lighthouse.uploadBuffer(
      file.buffer,
      process.env.LIGHTHOUSE_API_KEY,
      file.originalname,
      undefined,
      undefined,
      {
        'Accept': 'application/json',  // ← Critical addition
        'Content-Type': file.mimetype,
        'Authorization': `Bearer ${process.env.LIGHTHOUSE_API_KEY}`
      }
    );
    const imageUrl = `https://gateway.lighthouse.storage/ipfs/${imageResponse.data.Hash}`;

    const metadata = {
      name: req.body.name,
      description: req.body.description,
      image: imageUrl
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], { 
      type: 'application/json' 
    });
    const metadataBuffer = Buffer.from(await metadataBlob.arrayBuffer());
    
    const metadataResponse = await lighthouse.uploadBuffer(
      metadataBuffer,
      process.env.LIGHTHOUSE_API_KEY,
      'metadata.json'
    );

    // Final Metadata URL
    res.json({
      metadataUrl: `https://gateway.lighthouse.storage/ipfs/${metadataResponse.data.Hash}`
    });

  } catch (error) {
    console.error('NFT Upload Error:', error);
    console.log(typeof(error));
    res.status(500).json({ error: 'NFT creation failed' });
  }
});

if (require.main === module) {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`NFT Proxy Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;