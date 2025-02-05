const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user.route');
const exerciseRoutes = require('./routes/exercise.route');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Use routes
app.use('/api', userRoutes);
app.use('/api', exerciseRoutes);

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
