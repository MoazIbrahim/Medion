const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    first : {
        type: String,
        required : true,
    },
    last : {
        type: String,
        required : true,
    },
    department : {
        type: String,
        enum : ['Computer Engineering' , 'Electrical Engineering' , 'Industrial Engineering' , 'Civil Engineering' , 'Biomedical Engineering']
    },
    semester: {
        type: String,
        enum: ['Fall', 'Spring', 'Summer']
      },
      year: {
        type: Number,
        enum: [1, 2, 3, 4]
      },

    email : {
        type : String,
        required: true,
        unique: true
    },
    type : {
        type : String , 
        required : true 
    },
    profilePicture: {
        type: String,
        default: 'https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Image.png' 
    },
    notes : {
        type: String

    },
    courses :[ {
        type : Schema.Types.ObjectId,
        ref: 'Course'
    }
],
assignments : [
    {
        type : Schema.Types.ObjectId,
        ref: 'Assignment'
    }
],
payments : [
    {
        type : Schema.Types.ObjectId,
        ref: 'Payment'
    }
],
chat : [
    {
        message : String ,
        timestamp : Date ,
        sender : { 
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        recipient : { 
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    }
],
totalWeightedPoints: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
gpa : {
    type : Number ,
    default : 2
},
completedCourses: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }
],
uncompletedCourses: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }
],
studentEcts: {
    type: Number,
    default: 0
}
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User' , userSchema);