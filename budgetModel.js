const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  title: String,
  budget: Number,
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;