const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const dbConnection = require('./utils/dbConnect');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


dbConnection()
  .then(() => {
    console.log('Database connected successfully');

    // Routes
    const photoRoutes = require('./routes/crudRoute');
    app.use('/api', photoRoutes);

    app.listen(process.env.PORT || 3000, () => {
      console.log(`app was listening on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
  });