import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Photo from './models/photo.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clicktales', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Get all photos
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload photo
app.post('/api/photos', async (req, res) => {
  try {
    const { image, filter } = req.body;
    if (!image) return res.status(400).json({ error: 'Image field is required.' });
    const photo = new Photo({ image, filter });
    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get individual photo
app.get('/api/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: 'Photo not found.' });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete photo
app.delete('/api/photos/:id', async (req, res) => {
  try {
    await Photo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// Example for HomePage or App.js
import { useEffect, useState } from "react";

function HomePage() {
  const [started, setStarted] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [filter, setFilter] = useState("");

  // Fetch photos from backend on mount
  useEffect(() => {
    fetch("http://localhost:4000/api/photos")
      .then(res => res.json())
      .then(data => setCapturedImages(data))
      .catch(err => console.error(err));
  }, []);

  function handleCapture(img) {
    fetch("http://localhost:4000/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: img, filter }),
    })
      .then(res => res.json())
      .then(newPhoto => setCapturedImages(prev => [newPhoto, ...prev]))
      .catch(err => console.error(err));
  }

  // ...rest of your HomePage code
}