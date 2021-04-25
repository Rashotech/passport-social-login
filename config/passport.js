require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user')
var FbStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const utils = require('../lib/utils');

// passport-jwt options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

module.exports = (passport) => {
    // Jwt strategy
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        // user look up in the database
        User.findOne({_id: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }           
        });
    }));

    passport.use(new FbStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        scope: [ "email" ],
        profileFields: ['id', 'displayName', 'name', 'photos', 'email']
      },
      async function(accessToken, refreshToken, profile, done) {
        const { id, email, first_name, last_name } = profile._json;
        User.findOne({ sid: id }, async function (err, user) {
            if(user === null) {
                const data = {
                    sid: id,
                    email: email,
                    firstName: first_name,
                    lastName: last_name
                }
                    await User.create(data)
                        .then((user) => {
                            const tokenObject = utils.issueJWT(user);
                            const data = { ...user._doc, ...tokenObject }
                            return done(err, data);
                        })
                        .catch((err) => {
                            return done(err, false);
                        })
            } else {
                const tokenObject = utils.issueJWT(user);
                const data = { ...user._doc, ...tokenObject }
                return done(err, data);
            }
        });
      }));

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
        const { sub, email, given_name, family_name } = profile._json;
        User.findOne({ sid: sub }, async function (err, user) {
            if(user === null) {
                const data = {
                    sid: sub,
                    email: email,
                    firstName: given_name,
                    lastName: family_name
                }
                    await User.create(data)
                        .then((user) => {
                            const tokenObject = utils.issueJWT(user);
                            const data = { ...user._doc, ...tokenObject }
                            return done(err, data);
                        })
                        .catch((err) => {
                            return done(err, false);
                        })
            } else {
                const tokenObject = utils.issueJWT(user);
                const data = { ...user._doc, ...tokenObject }
                return done(err, data);
            }
        });
      }
    ));
    
}