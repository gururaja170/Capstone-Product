const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ userid: req.body.userid });
  if (user) return res.status(400).send("User Already Exists");

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    userid: req.body.userid,
    password: hashed,
  });
  try {
    user = await user.save();
    res.send(_.pick(user, ["_id", "name", "userid"]));
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

module.exports = router;
