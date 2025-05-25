const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    image: String,
    email: String,
    name: String
});

module.exports = mongoose.model('user', userSchema);
