const mongoose = require("mongoose");
const validator = require("validator");


const UserSchema = new mongoose.Schema({
  isDisabled: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Provide a Email"],
    maxlength: [100, "Email Cannot excced 50 characters"],
    validate: [validator.isEmail, "Please Enter a valid Email Address"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  username: {
    type: String,
    required: [true, "Provide a username"],
    maxlength: [100, "Username Cannot excced 50 characters"],
  },
  profileimage: {
    type: String,
    default: "",
  },
  cart: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);