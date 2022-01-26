require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

// INITIALIZE EXPRESS APP
const app = express();

// PORT
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(express.json());
app.use(cors());

//connetion URI of mongodb
const uri = process.env.MONGODB_URI;

// connect to mongodb database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
  } catch (error) {
    console.log(error.message);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('welcome to trellas [A travel sharing website]');
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
