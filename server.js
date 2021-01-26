//load in environment variables:
if (process.env.NODE_ENV !== 'production') {
    // load in all environment variables from .env file and set them in process.env
    require('dotenv').config();
}
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
// let app use json from the body of the req 
app.use(express.json());
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

const posts = [
    {
        username: "Avshalom",
        title: "Post 1"
    },
    {
        username: "jim",
        title: "Post 2"
    },
    {
        username: "avi",
        title: "Post 3"
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    console.log(req.headers['authorization'])
    const authHeader = req.headers['authorization'];
    // authHeader looks like: 'Bearer token' so:
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    // verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        // we have valid token - so set the user of request to our the user object,
        // so we can access req.user.name and get the right name!
        req.user = user
        next() // move on from middleware
    })
}

app.listen(process.env.PORT, () => {
    console.log('Server is up on port ' + process.env.PORT)
})