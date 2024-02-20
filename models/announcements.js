const mongoose = require('mongoose');



const announcementSchema = new mongoose.Schema({
  
  content: {
    type: String,
    required: true
  },
  
  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
timeCreated : {
  type : Date,
  default: Date.now
}

});

module.exports = mongoose.model('Announcement', announcementSchema);

