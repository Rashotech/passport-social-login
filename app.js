require('dotenv').config();
const express = require('express');
const passport = require('passport');
require('./config/database');
require('./config/passport')(passport);
const Routes = require('./routes');

const PORT = process.env.PORT || 3000;

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(Routes);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
