const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ userid: req.body.userid });
  if (!user) return res.status(400).send("Invalid Email or Password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or Password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    userid: Joi.string().max(300).required().label("User ID"),
    password: Joi.string().required().label("Password"),
  });
  const result = schema.validate(user);
  return result;
}

module.exports = router;
