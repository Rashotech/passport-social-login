require('dotenv').config();
const express = require('express');
const path = require("path");
const cors = require("cors");
const passport = require('passport');
require('./config/database');
require('./config/passport')(passport);
const Routes = require('./routes');

const PORT = process.env.PORT || 3000;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))

// CORS
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 204,
  };
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());

app.use(Routes);

// middleware to handle invalid routes
app.use((req, res, next) => {
    const error = new Error('Could not find this route');
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.render('error')
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
