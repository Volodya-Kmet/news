const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    userRoute = require('./app/routes/userRoute'),
    newsRoute = require('./app/routes/newsRoute'),
    path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// REGISTER ROUTES
// =======================================================
app.use('/user', userRoute);
app.use('/news', newsRoute);

module.exports = app;