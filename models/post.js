const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  date : {
    type : Date ,
    default: Date.now

  }, 
  course : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});





module.exports = mongoose.model('Post' , postSchema);