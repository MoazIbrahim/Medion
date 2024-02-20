const mongoose = require('mongoose');



const CourseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    required: true
  },
  ects: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    enum: ['Fall','Spring','Summer']
  },
  year : { 
    type : Number,
    enum : [1,2,3,4]
  },
  department: {
    type: String,
    enum: ['Computer Engineering', 'Civil Engineering', 'Electrical Engineering', 'Industrial Engineering', 'Biomedical Engineering']
  },
  prereq: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ] ,
  startDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setMonth(1); // Month is zero-indexed, so 9 represents October
      date.setDate(10);
      return date;
    }
  },
  endDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setMonth(5); // Month is zero-indexed, so 9 represents October
      date.setDate(30);
      return date;
    }
  },
  coreq : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ] ,
  completed : {
    type : Boolean ,
    default : false 
  },
  completedByUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  mainCourse: {
type : Boolean,
default: true
  },
  time: {
    day: {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      
    },
    time: {
      type: String,
      
    }
  },
  syllabus: {
    midterm: {
      type: Number,
      required: true,
      default : 30
    },
    final: {
      type: Number,
      required : true,
      default : 40
    },
    project: {
      type: Number,
      default : 0
     
    },
    assignments : {
      type : Number,
      default : 15
    },
    quizzes : {
      type : Number,
      default : 15
    },
    labs : {
      type : Number,
      default : 0

    },
    attendance : {
      type : Number,
      default : 0
    },
    bonus : {
      type : Number,
      default : 0
    }
  },
  posts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
],
surveyPoints : {
  type : Number,
  default: 0
  
},
surveyUser : [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: []
}],
progression : {
  type: Number,

}
});





module.exports = mongoose.model('Course' , CourseSchema);