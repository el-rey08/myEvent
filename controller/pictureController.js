const PictureModel = require('../models/picture');
const eventModel = require('../models/eventModel');
const cloudinary = require('../utils/cloudinary');
const pictureModel = require('../models/picture');

exports.uploadPicture = async (req, res) => {
  const { eventId } = req.params;

  try {
    const image = await cloudinary.uploader.upload(req.file.path, { folder: 'event_pictures' });
    
    const picture = new PictureModel({
      event: eventId,
      imageUrl: image.secure_url,
      uploadedBy: req.user ? req.user.userId : 'Guest',
      publicId: image.public_id,
    });
    await picture.save();
    await eventModel.findByIdAndUpdate(eventId, { $push: { pictures: picture._id } });
    res.status(201).json({ message: 'Picture uploaded successfully', picture });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload picture' });
  }
};

exports.addComment = async (req, res) => {
  const { pictureId } = req.params;
  const { text } = req.body;

  try {
    const picture = await PictureModel.findById(pictureId);
    if (!picture) return res.status(404).json({ error: 'Picture not found' });

    const postedBy = req.user ? req.user.userId : 'Guest'; 
    picture.comments.push({ text, postedBy });

    await picture.save();
    res.status(201).json({ message: 'Comment added successfully', comments: picture.comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.getComments = async (req, res) => {
  const { pictureId } = req.params;

  try {
    const picture = await PictureModel.findById(pictureId).select('comments');
    if (!picture){
      return res.status(404).json({ error: 'Picture not found' })
    };
    res.status(200).json({ comments: picture.comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
};

exports.getPicture = async (req, res) => {
  const { pictureId } = req.params;

  try {
    const picture = await PictureModel.findById(pictureId).populate('comments.postedBy', 'username');
    if (!picture) {
      return res.status(404).json({ error: 'Picture not found' })
    };
    res.status(200).json({ picture });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve picture details' });
  }
};

exports.removePicture = async(req, res)=>{
  const {pictureId} = req.body
try{
  const picture = await pictureModel.findById(pictureId)
  if(!picture){}
}catch(error){
  res.status(500).json({ error: 'Failed to retrieve picture details' });
}
}

