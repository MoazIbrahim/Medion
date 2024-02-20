const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradesSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    midterm: {
      type: Number,
    
      default: 0
    },
    final: {
      type: Number,
   
      default: 0
    },
    project: {
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
  });

module.exports = mongoose.model('Grade' , gradesSchema);