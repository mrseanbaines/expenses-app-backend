const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

// Load environment variables from the `.env` file.
require('dotenv').config();

const app = express();

// Add headers
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Pass to next layer of middleware
  next();
});

// Setup useful middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

// Define routes
app.use('/expenses', require('./routes/expenses'));

app.use('/categories', require('./routes/categories'));

// Start the server on the correct port
const server = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on port ${server.address().port}`);
});
