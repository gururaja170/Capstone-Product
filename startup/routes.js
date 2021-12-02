const express = require("express");
const cors = require("cors");
const useraccounts = require("../routes/useraccounts");
const auth = require("../routes/auth");
const transactions = require("../routes/transactions");
const users = require("../routes/users");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/accounts", useraccounts);
  app.use("/api/transactions", transactions);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);
};
