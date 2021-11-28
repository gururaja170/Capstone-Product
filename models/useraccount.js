const Joi = require("joi");
const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);

const userAccountSchema = new mongoose.Schema({
  userid: {
    type: String,
    minlength: 5,
    maxlength: 300,
  },
  account_id: {
    type: Number,
    unique: true,
  },
  balance: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 300,
  },
  lien: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  limit: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
});
userAccountSchema.plugin(sequence, {
  inc_field: "account_id",
  start_seq: 1001,
});

const UserAccount = mongoose.model("UserAccount", userAccountSchema);

function validateUserAccount(userAccount) {
  const schema = Joi.object({
    userid: Joi.string().label("User ID"),
    account_id: Joi.number().label("Account ID"),
    phone: Joi.string().min(10).max(10).required().label("Phone Number"),
    email: Joi.string().required().label("E-Mail Address").email(),
    balance: Joi.number().min(0).label("Balance"),
    lien: Joi.number().min(0).label("Lien Amount"),
    limit: Joi.number().min(0).label("Limit Amount"),
  });
  const result = schema.validate(userAccount);
  return result;
}

module.exports.UserAccount = UserAccount;
module.exports.validate = validateUserAccount;
