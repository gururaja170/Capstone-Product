const express = require("express");
const logger = require("./startup/logger");
const app = express();

require("./startup/logger");
require("./startup/routes")(app);
require("./startup/dbMongo")();
require("./startup/config")();
require("./middleware/prod")(app);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
