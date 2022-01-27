require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const User = require('./models/User/User');
const Blog = require('./models/Blog/Blog');

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
    app.get('/user/isAdmin', async (req, res) => {
      const { email } = req.query;
      const user = await User.findOne({ email });
      const isAdmin = user?.role === 'admin';
      res.json({ admin: isAdmin }); // send the admin status of user to client side
    });

    // (READ) --> GET ALL BLOGS FROM DATABASE (WITH QUERY)
    app.get('/blogs', async (req, res) => {
      const { price, rating, category } = req.query;
      const filter = {};
      if (price || rating || category) {
        filter = { price, rating, category };
      }
      const blogs = await Blog.find(filter);
      res.json(blogs); // send all the blogs to user
    });

    // (READ) --> GET A SINGLE BLOG FROM THE DATABASE
    app.get('/blogs/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const query = { _id: ObjectId(id) }; // query for single blog

        const singleBlog = await Blog.findOne(query); // find the single blog

        res.json(singleBlog); // send the blog to client side.
      } catch (error) {
        next(error);
      }
    });

    // (CREATE) --> CREATE A BLOG IN DATABASE
    app.post('/blogs', async (req, res) => {
      const newBlog = req.body; // blog info

      // insert the blog in blogs collection
      const result = await Blog.insertMany({
        ...newBlog,
        status: 'pending',
      });

      res.json(result); // response after adding blog info in the database
    });

    //(UPDATE) --> UPDATE THE BLOG APPROVAL STATUS
    app.put('/blogs/:id', async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };

      const options = { upsert: true };

      // update the blog status
      const updateBlogStatus = {
        $set: {
          status: 'approved',
        },
      };

      const result = await Blog.updateOne(filter, updateBlogStatus, options);

      res.json(result); // send the response to client
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

    //(UPDATE) --> UPDATE A SPECIFIC BLOG
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const fitler = { _id: ObjectId(id) }; // query for single blog

      const newBlog = req.body;

      const updateDoc = { $set: newBlog };

      const result = await User.updateOne(filter, updateDoc);

      res.json(result); // send the respone to client side
    });

    //(UPDATE) --> UPDATE THE USER ROLE
    app.put('/user/makeAdmin', async (req, res) => {
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

    // (DELETE) --> DELETE A BLOG FROM THE DATABASE
    app.delete('/blogs/:id', async (req, res, next) => {
      try {
        const id = req.params.id;

        const query = { _id: ObjectId(id) };

        const result = await Blog.deleteOne(query); // delete the matched blog from database

        res.json(result); // send the response to client side
      } catch (error) {
        next(error);
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
