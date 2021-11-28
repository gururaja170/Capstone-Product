const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 300,
  },
  userid: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 300,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, userid: this.userid },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(300).required().label("Name"),
    userid: Joi.string().min(5).max(300).required().label("User ID"),
    password: Joi.string().min(5).max(300).required().label("Password"),
  });
  const result = schema.validate(user);
  return result;
}

module.exports.User = User;
module.exports.validate = validateUser;
