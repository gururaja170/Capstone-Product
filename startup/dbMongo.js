const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logger");

module.exports = function () {
  mongoose
    .connect(config.get("dbURL"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
      ssl: true,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
