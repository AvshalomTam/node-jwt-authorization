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
// app.set('view-engine', 'ejs');
// app.use(express.urlencoded({ extended: false }));

let refreshTokens = [];

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    console.log(refreshToken)
    if (refreshToken == null) {
        console.log('thiss')
        return res.sendStatus(401)
    }
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken : accessToken});
    })
})

app.delete('/logout', (req, res) => {
    // modify refreshtokes list - we delete it from the list
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.post('/login', (req, res) => {
    // authenticate user - already done
    // we assume this user passed the correct username & password
    const username = req.body.username;
    const user = {
        name: username
    }
    // we want to serialize a user + we give the function a secretkey
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

app.listen(process.env.PORT2, () => {
    console.log('Server is up on port ' + process.env.PORT2)
})