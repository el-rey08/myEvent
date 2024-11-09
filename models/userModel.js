const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    required: true,
    trim:true
  },
  email:{
    type: String,
    required: true,
    trim: true
  },
  password:{
    type: String,
    required : true,
  },
  profile:{
    type: String,
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});
const userModel= mongoose.model('User', userSchema);
 module.exports = userModel
