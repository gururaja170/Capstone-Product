const config = require("config");

module.exports = function () {
  const jwtPrivateKey = config.get("jwtPrivateKey");
  if (!jwtPrivateKey) {
    throw new Error("FATAL ERROR : jwt Private Key is not defined");
  }

  const dbURL = config.get("dbURL");
  if (!dbURL) {
    throw new Error("FATAL ERROR : dbURL is not defined");
  }
};
