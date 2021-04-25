require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');

function issueJWT(user) {
  const _id = user._id;
  const expiresIn = '7d';
  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.SECRET, { expiresIn: expiresIn });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

module.exports.issueJWT = issueJWT;
