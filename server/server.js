require('dotenv').config();
const express = require('express');
const cors = require('cors');
const lighthouse = require('@lighthouse-web3/sdk');
const multer = require('multer');
const { Blob } = require('buffer');

// Initialize Express
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:3001'
}));
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// NFT Upload Endpoint
app.post('/api/upload-nft', upload.single('image'), async (req, res) => {
  try {
    // 1. Upload Image
    const imageResponse = await lighthouse.uploadBuffer(
      req.file.buffer,
      process.env.LIGHTHOUSE_API_KEY,
      req.file.originalname
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

    // 4. Return Final Metadata URL
    res.json({
      metadataUrl: `https://gateway.lighthouse.storage/ipfs/${metadataResponse.data.Hash}`
    });

  } catch (error) {
    console.error('NFT Upload Error:', error);
    res.status(500).json({ error: 'NFT creation failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`NFT Proxy Server running on http://localhost:${PORT}`);
});