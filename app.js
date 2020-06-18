const express = require('express');
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes 
app.use('/api', require('./routes'));
app.get('/api/ping', (req, res) => {
  res.send('pong');
});


module.exports = app;