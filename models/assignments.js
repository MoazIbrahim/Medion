const mongoose = require('mongoose');



const assignmentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum : ['Assignment' , 'Quiz' , 'Midterm' , 'Final' , 'Lab Assignment' , 'Project']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignmentfiles : [
    { url: String , filename : String }
  ],
  dueDate: {
    type: String,
    required: true
  },
  course : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  weight: {
    midterm: {
      type: Number,
      default: 0
    },
    final: {
      type: Number,
      default: 0
    },
    assignments: {
      type: Number,
      default: 0
    },
    quizzes: {
      type: Number,
      default: 0
    },
    labs: {
      type: Number,
      default: 0
    },
    attendance: {
      type: Number,
      default: 0
    },
    bonus: {
      type: Number,
      default: 0
    }
  }
});





module.exports = mongoose.model('Assignment', assignmentSchema);

