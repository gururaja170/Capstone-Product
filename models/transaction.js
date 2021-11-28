const Joi = require("joi");
const mongoose = require("mongoose");

const Transaction = mongoose.model(
  "Transaction",
  new mongoose.Schema({
    sender: {
      type: Number,
      required: true,
    },
    receiver: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  })
);

function validateTransaction(transaction) {
  const schema = Joi.object({
    sender: Joi.number().required().label("Sender Account Number"),
    receiver: Joi.number().required().label("Receiver Account Number"),
    amount: Joi.number().min(0).required().label("Amount"),
  });
  const result = schema.validate(transaction);
  return result;
}

module.exports.Transaction = Transaction;
module.exports.validate = validateTransaction;
