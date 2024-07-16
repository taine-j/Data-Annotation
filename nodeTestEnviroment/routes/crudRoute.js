// routes/crudRoute.js
const express = require('express');
const router = express.Router();

// Define a GET route for fetching photos
router.get('/photos', (req, res) => {
  res.json({ message: 'Photos fetched successfully', data: [] });
});

module.exports = router;