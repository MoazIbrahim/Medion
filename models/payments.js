const { required, string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
   
    description : {
        type : String
    },
    year : {
        type : String
    },
    requiredPayment : { 
        type : Number,
      
    },
    remainingPayment : { 
        type : Number ,
   
    },
    paidPayment : {
      
            type : Number ,
             
    },

  });

module.exports = mongoose.model('Payment' , paymentsSchema);