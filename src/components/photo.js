import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  image: { type: String, required: true },
  filter: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Photo', photoSchema);