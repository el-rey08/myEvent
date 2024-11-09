const mongoose = require('mongoose');

const eventSchema =  new mongoose.Schema({
eventName:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
owner:{
    type: mongoose.Schema.Types.ObjectId, ref: 'User' 
},
startDateTime: {
    type: Date
}, 
endDateTime:{
    type: Date
},  

pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }],

qrCode:{
    tyoe:String
}
});

const eventModel = mongoose.model('event', eventSchema)

module.exports = eventModel