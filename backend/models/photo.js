const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // base64 or image URL
    filter: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('Photo', PhotoSchema);