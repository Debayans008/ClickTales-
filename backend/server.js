const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let photos = [];

app.get('/api/photos', (req, res) => {
  res.json(photos);
});

app.post('/api/photos', (req, res) => {
  const { image, filter } = req.body;
  const newPhoto = { image, filter, id: Date.now() };
  photos.unshift(newPhoto);
  res.json(newPhoto);
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});