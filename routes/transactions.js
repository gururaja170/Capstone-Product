const { Transaction, validate } = require("../models/transaction");
const { UserAccount } = require("../models/useraccount");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
mongoose.modelSchemas = {};
Fawn.init(mongoose);

// router.get("/", auth, async (req, res) => {
//   const transactions = await Transaction.find();
//   res.send(transactions);
// });

router.get("/:accnum", auth, async (req, res) => {
  const accnum = parseInt(req.params.accnum);
  const transaction = await Transaction.find()
    .or([{ sender: accnum }, { receiver: accnum }])
    .sort("-created_at")
    .limit(10);
  if (!transaction)
    return res.status(404).send("No Transaction found with given ID");

  res.send(transaction);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.sender === req.body.receiver)
    return res.status(400).send("Sender and Receiver must be different");

  const sender = await UserAccount.findOne({ account_id: req.body.sender });
  if (!sender) return res.status(403).send("Invalid Account Number");
  if (sender.userid !== req.user.userid)
    return res.status(400).send("Invalid Transaction Details");

  const receiver = await UserAccount.findOne({ account_id: req.body.receiver });
  if (!receiver) return res.status(403).send("Invalid Account Number");

  const amount = req.body.amount;

  if (amount > sender.limit)
    return res.status(400).send("Exceeded Limit Amount");

  if (sender.balance - sender.lien - amount < 0)
    return res.status(400).send("Insufficient Funds");

  let transaction = new Transaction({
    sender: req.body.sender,
    receiver: req.body.receiver,
    amount: amount,
  });
  try {
    new Fawn.Task()
      .update(
        "useraccounts",
        { account_id: req.body.sender },
        { $inc: { balance: -amount } }
      )
      .update(
        "useraccounts",
        { account_id: req.body.receiver },
        { $inc: { balance: amount } }
      )
      .save("transactions", transaction)
      .run({ useMongoose: true })
      .then(res.send(transaction))
      .catch("Something Happened");
  } catch (ex) {
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
