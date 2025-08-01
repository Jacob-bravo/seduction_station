const mongoose = require("mongoose");


const Models = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Provide a username"],
        maxlength: [50, "Username Cannot excced 50 characters"],
    },
    lastActiveTimeStamp: {
        type: String,
        required: false,
        default: Date.now

    },
    about: {
        type: String,
        default: "",
        maxlength: [250, "about Cannot excced 50 characters"],
    },
    profileimage: {
        type: String,
        default: "",
    },
    Photos: {
        type: Array,
        default: [],
    },
    Videos: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Models", Models);