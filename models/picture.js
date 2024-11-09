const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  postedBy: { type: String, required: true },
});

const pictureSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  imageUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  comments: [commentSchema],
});

const pictureModel= mongoose.model('Picture', pictureSchema);
module.exports = pictureModel
