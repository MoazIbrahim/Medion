const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    solutionFiles: [
      { url: String, filename: String }
    ],
    submissionDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    points : {
      type : Number,
      default : 0
    },
    weightedPoints : {
      type : Number,
      default : 0
    },
    plagiarismPercentage : { 
      type : Number,
      
    }
  });

  module.exports = mongoose.model('Submission', submissionSchema);