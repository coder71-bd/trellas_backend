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
    // (READ) --> FIND ALL USER
    app.get('/users', async (req, res) => {
      const users = await User.find();
      res.json(users); // send all the users
    });

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
      let query = {};

      if (rating && price && category) {
        query = { price: { $gt: 2999, $lt: price + 1 }, rating, category };
      }

      const blogs = await Blog.find(query);
      res.json(blogs); // send all the blogs to user
    });

    // (READ) --> GET ALL BLOGS (FOR PAGINATION)
    app.get('/pagination/blogs', async (req, res) => {
      const { page, size, isAdmin } = req.query;

      let count;
      if (isAdmin === 'true') {
        count = await Blog.count({});
      } else {
        count = await Blog.count({ status: 'approved' });
      }

      console.log(count);

      const blogs = await Blog.find()
        .skip(parseInt(page) * parseInt(size))
        .limit(parseInt(size));

      res.send({
        count,
        blogs,
      });
    });

    // (READ) --> GET A SPECIFIC USER BLOGS
    app.get('/user/blogs', async (req, res) => {
      const email = req.query.email;

      const userBlogs = await Blog.find({ email }); // find the specific user blogs

      res.json(userBlogs); // send the blogs to client side.
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
      const result = await Blog.insertMany(newBlog);

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

    //(UPDATE) --> UPDATE A SPECIFIC BLOG
    app.put('/blogs/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }; // query for single blog

      const newBlog = req.body;

      const updateDoc = { $set: newBlog };

      const result = await Blog.updateOne(filter, updateDoc);

      res.json(result); // send the respone to client side
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
    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await Blog.deleteOne(query); // delete the matched blog from database

      res.json(result); // send the response to client side
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
