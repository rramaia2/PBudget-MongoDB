const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017'; // Your MongoDB connection URL
const dbName = 'myBudget'; // Your MongoDB database name

mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;