<h1 align="center">Trellas Server side</h1>

<div>
Client side implemented through this backend <a href="https://trellas1.web.app/">Trellas</a>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Built With](#built-with)
- [Features](#features)
- [API](#API)
- [Contact](#contact)

### Built With

- Node
- Express
- Mongodb
- cors
- dotenv
- nodemon

## Features

This is the backend of trellas website. Please Look below to see the use of API endpoints in this project. The below example is given by using axios.

## API

<h3 align="center">READ MEHTODS OF CRUD</h3>

<div>
<p>Get all blogs from database</p>
    <code>
        axios.get('https://trellas-backend.herokuapp.com/blogs').then((response) => console.log(response.data));
    </code>
</div>
<div>
<p>Get all blogs from database with query</p>
    <code>
        axios.get(`https://trellas-backend.herokuapp.com/blogs?rating=${rating}&price=${price}&category=${category}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get all blogs for pagination</p>
    <code>
        axios.get(`https://trellas-backend.herokuapp.com/pagination/blogs/?page=${page}&size=${size}&admin=${admin}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get all the user review info from database</p>
    <code>
        axios.get('https://trellas-backend.herokuapp.com/reviews').then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get all the order info from database</p>
    <code>
        axios.get('https://trellas-backend.herokuapp.com/orders').then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get a specific user blogs</p>
    <code>
        axios.get('https://trellas-backend.herokuapp.com/blogs?email=${email}').then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get a single blog info</p>
    <code>
        axios.get(`https://trellas-backend.herokuapp.com/blogs/${id}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get a single blog</p>
    <code>
        axios.get(`https://trellas-backend.herokuapp.com/order/${email}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get all user info</p>
    <code>
        axios.get(`https://trellas-backend.herokuapp.com/user`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Get if a user is admin or not</p>
    <code>
        axios.get(`https://trellas-backend.herokuapp.com/user/isAdmin?email=${email}`).then((response) => console.log(response.data));
    </code>
</div>

<h3 align="center">CREATE METHODS OF CRUD</h3>

<div>
<p>Create a product in database</p>
    <code>
        axios.post('https://trellas-backend.herokuapp.com/bikes', orderInfoObject).then((response) => console.log(response.data));
    </code>
</div>

<h3 align="center">UPDATE MEHTODS OF CRUD</h3>

<div>
<p>Update a specific blog</p>
    <code>
        axios.put(`https://trellas-backend.herokuapp.com/blogs/update/${id}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Update the blog approval status</p>
    <code>
        axios.put(`https://trellas-backend.herokuapp.com/blogs/${id})`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Update an user role </p>
    <code>
        axios.put(`https://trellas-backend.herokuapp.com/users/makeAdmin`).then((response) => console.log(response.data));
    </code>
</div>

<h3 align="center">DELETE MEHTODS OF CRUD</h3>

<div>
<p>Delete an order</p>
    <code>
        axios.delete(`https://trellas-backend.herokuapp.com/orders/${id}`).then((response) => console.log(response.data));
    </code>
</div>

<div>
<p>Delete a blog</p>
    <code>
        axios.delete(`https://trellas-backend.herokuapp.com/blogs/${id}`).then((response) => console.log(response.data));
    </code>
</div>

## Contact

- GitHub [@coder71-bd](https://github.com/coder71-bd)
