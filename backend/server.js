const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let photos = [];

// GET all photos
app.get("/api/photos", (req, res) => {
  res.json(photos);
});

// POST a new photo
app.post("/api/photos", (req, res) => {
  const { image, filter } = req.body;
  const newPhoto = { image, filter, id: Date.now() };
  photos.unshift(newPhoto);
  res.json(newPhoto);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});