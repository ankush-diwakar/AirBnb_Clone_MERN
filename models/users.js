const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email : {
        type : String,
        required : true
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);