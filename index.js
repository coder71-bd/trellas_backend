require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User/User');

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
    // (READ) --> FIND A USER IS ADMIN OR NOT
    app.get('/user/isAdmin', async (req, res, next) => {
      const { email } = req.query;
      const user = await User.findOne({ email });
      const isAdmin = user?.role === 'admin';
      res.json({ admin: isAdmin }); // send the admin status of user to client side
    });

    //(UPDATE) --> UPDATE AN USER
    app.put('/user', async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };

      const options = { upsert: true };

      const updateDoc = { $set: user };

      const result = await User.updateOne(filter, updateDoc, options);

      res.json(result); // send the respone to client side
    });

    //(UPDATE) --> UPDATE THE USER ROLE
    app.put('/user/makeAdmin', async (req, res, next) => {
      const user = req.body; // will come from frontend ({requester: email, newAdminEmail: email})

      if (user?.requester) {
        const requesterAccount = await User.findOne({
          email: user.requester,
        }); // find the requester info in database

        // check if the requester is admin or not
        if (requesterAccount?.role === 'admin') {
          const filter = { email: user.newAdminEmail };

          const updateDoc = { $set: { role: 'admin' } };

          const result = await User.updateOne(filter, updateDoc);

          res.json(result); // send the result after updating an user role
        } else {
          res
            .status(403)
            .json({ message: 'you do not have access to make admin' });
        }
      } else {
        res.status(404).json({
          message:
            'Please make sure the user that you want to make admin is available in database.',
        });
      }
    });
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
