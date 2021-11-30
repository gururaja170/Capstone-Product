const { UserAccount, validate } = require("../models/useraccount");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

// router.get("/", auth, async (req, res) => {
//   const userAccounts = await UserAccount.find();
//   res.send(userAccounts);
// });

router.get("/:userid", auth, async (req, res) => {
  const userAccount = await UserAccount.find({ userid: req.params.userid });
  if (!userAccount)
    return res.status(404).send("No Account found with given ID");

  res.send(userAccount);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userAccount = new UserAccount({
    userid: req.user.userid,
    balance: req.body.balance,
    phone: req.body.phone,
    email: req.body.email,
    lien: req.body.lien,
    limit: req.body.limit,
  });
  try {
    userAccount = await userAccount.save();
    res.send(userAccount);
  } catch (ex) {
    return res.status(400).send(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userAccount = await UserAccount.findByIdAndUpdate(
    req.params.id,
    {
      balance: req.body.balance,
      phone: req.body.phone,
      email: req.body.email,
      lien: req.body.lien,
      limit: req.body.limit,
    },
    { new: true }
  );
  if (!userAccount)
    return res.status(404).send("No Account found with given ID");

  res.send(userAccount);
});

// router.delete("/:id", auth, async (req, res) => {
//   const userAccount = await UserAccount.findByIdAndRemove(req.params.id);
//   if (!userAccount)
//     return res.status(404).send("No Account found with given ID");

//   res.send(userAccount);
// });

module.exports = router;
