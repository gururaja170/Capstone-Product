require("express-async-errors");
const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const useraccounts = require("./routes/useraccounts");
const auth = require("./routes/auth");
const transactions = require("./routes/transactions");
const users = require("./routes/users");
const app = express();

const jwtPrivateKey = config.get("jwtPrivateKey");
if (!jwtPrivateKey) {
  console.error("FATAL ERROR : jwt Private Key is not defined");
  process.exit(1);
}

const dbURL = config.get("dbURL");
if (!dbURL) {
  console.error("FATAL ERROR : dbURL is not defined");
  process.exit(1);
}

mongoose
  .connect(config.get("dbURL"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    ssl: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Connection to MongoDB Failed..."));

app.use(express.json());
app.use("/api/accounts", useraccounts);
app.use("/api/transactions", transactions);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
