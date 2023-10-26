const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pBought: {
    type: String,
    required: true
  },

  due: {
    type: String,
    required: true
  },
  date:{
    type:Date,
    required:true
  }
  
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;