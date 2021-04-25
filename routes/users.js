const router = require('express').Router();   
const User = require('../models/user')
const passport = require('passport');
const utils = require('../lib/utils');
const bcrypt = require('bcrypt');

// protected route
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

// Validate an existing user and issue a JWT
router.post('/login', async function(req, res, next) {
    const { login, password } = req.body;
    
    if (login && password) {
        var user = await User.findOne({
            $or: [
                { phone: login },
                { email: login  }
            ]
        })
        .catch((error) => {
            return res.status(400).json({ success: false, msg: "Something went wrong" });
        });

        if(user !== null) {
            var isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                const tokenObject = utils.issueJWT(user);
                return res.status(200).json({ success: true,  user: user, token: tokenObject.token, expiresIn: tokenObject.expires });
            } else {
                return res.status(401).json({ success: false, msg: "Login credentials incorrect" });
            }
    
        }

        return res.status(401).json({ success: false, msg: "could not find user" });
    } 
    
    return res.status(400).json({ success: false, msg:  "Make sure each field has a value" });
});

// Register a new user
router.post('/register', async function(req, res, next) {
    const { firstName, lastName, phone, email, password } = req.body;

    if (phone && email && password) {
        var user = await User.findOne({
            $or: [
                { phone: phone },
                { email: email  }
            ]
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({ success: false, msg: error });
        });

        if(user === null) {
            // No User Found4
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data).then((user) => {
                const tokenObject = utils.issueJWT(user);
                return res.status(200).json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });
            })
        } else {
            if(email === user.email || phone === user.phone) {
                return res.status(400).json({ success: false, msg: "Email or phone already in Use" });
            }
        }
    } else {
        return res.status(400).json({ success: false, msg: "Make sure each field has a valid value" });
    };
});

// facebook auth route
router.get("/facebook", passport.authenticate("facebook",  { session: false }));

// facebook auth route callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/auth/fail"
  }), (req, res) => {
    return res.status(200).json(req.user)
});

// failure route
router.get("/fail", (req, res) => {
    res.status(400).json({ success: false, msg:  "Something went wrong" })
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/auth/fail' }),
  function(req, res) {
    return res.status(200).json(req.user)
  });

module.exports = router;