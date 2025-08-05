const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  image: { type: String, required: true },   // base64 encoded image string
  filter: { type: String, default: "" },     // filter class name from frontend
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema);