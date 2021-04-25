const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    sid: { type: String, unique: true },
    firstName: { type: String, trim: true},
    lastName: { type: String, trim: true},
    phone: { type: String, trim: true, unique: true, sparse: true},
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, sparse: true},
    password: { type: String }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;