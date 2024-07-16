const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');  // Include the path module for resolving directory paths

const app = express();

// Middleware to log the time of every request
app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// Middleware to log the request type of each request at the '/request-type' route
app.use('/request-type', (req, res, next) => {
  console.log('Request type: ', req.method);
  next();
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname))); // Assuming 'index.html' is in the root directory
app.use(serveIndex(__dirname));  // Serve directory index for path '/' (optional)

// Specific route for '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Ensure the path is correctly specified
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Example app is listening on port 3000.');
});