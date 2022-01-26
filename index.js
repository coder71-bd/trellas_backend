require('dotenv').config();
const cors = require('cors');
const express = require('express');

// INITIALIZE EXPRESS APP
const app = express();

// PORT
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('welcome to trellas [A travel sharing website]');
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
