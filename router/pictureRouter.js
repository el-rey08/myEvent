const express = require('express');
const router = express.Router();
const pictureController = require('../controller/pictureController');
const upload = require('../utils/multer');
const {verifyGuest, authenticate, checkEventTiming} = require('../middleware/auth')
router.post(
    '/:eventId/upload',
    authenticate, checkEventTiming,
    verifyGuest,
    checkEventTiming,
    upload.single('image'),
    pictureController.uploadPicture
  );
  
  router.post(
    '/:pictureId/comment',
    authenticate, checkEventTiming,
    verifyGuest,
    pictureController.addComment
  );
  
  router.get('/:pictureId/comments', pictureController.getComments);
  
  module.exports = router;