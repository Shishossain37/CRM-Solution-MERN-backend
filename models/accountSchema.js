const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  }
});

const Account = mongoose.model('Account', eventSchema);

module.exports = Account;