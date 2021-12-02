const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

const dbTransport = new winston.transports.MongoDB({
  db: config.get("dbURL"),
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    ssl: true,
  },
  level: "error",
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.simple(),
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "allExceptions.log" }),
    dbTransport,
    consoleTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    dbTransport,
    consoleTransport,
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
    dbTransport,
    consoleTransport,
  ],
});

module.exports = logger;
