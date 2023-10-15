const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Required for parsing JSON in the request body

mongoose.connect('mongodb://127.0.0.1:27017/myBudget', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const budgetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^#[0-9A-Fa-f]{6}$/.test(value), // Ensure it's a 6-digit hexadecimal color
      message: 'Invalid color format. Color must be a 6-digit hexadecimal value (e.g., "#ED4523").',
    },
  },
});

const Budget = mongoose.model('Budget', budgetSchema, 'myBudgetData');

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/budget', async (req, res) => { // To fetch data
    try {
      const data = await Budget.find().exec();
      const chartData = {
        datasets: [
          {
            data: data.map(item => item.budget),
            backgroundColor: data.map(item => item.color), // Include colors
          },
        ],
        labels: data.map(item => item.title),
      };
      res.json(chartData);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.get('/budget-data', async (req, res) => {
  try {
    const data = await Budget.find().exec();
    res.json({ myBudget: data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-budget', async (req, res) => { // For adding new data
  const newData = req.body;

  try {
    const result = await Budget.create(newData);
    if (result) {
      console.log('Data added successfully');
      res.status(201).send('Data added successfully');
    } else {
      console.log('Failed to add data');
      res.status(500).send('Failed to add data');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
