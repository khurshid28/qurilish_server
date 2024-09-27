const dotenv = require("dotenv");
const path = require("path");

const bodyParser = require('body-parser');


dotenv.config();
require("./src/config/db.js");

var express = require("express");

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// all routes
const router = require("./src/routes/_index.js");

// built in middlewares
const logger = require("./src/middlewares/logger.js");
const rateLimit = require("./src/middlewares/rate-limit.js");
const errorHandler = require("./src/middlewares/error-handler.js");
const authMiddleware = require("./src/middlewares/authMiddleware");

const app = express();

// PORT
const PORT = process.env.PORT || 1212;

app.use(bodyParser.json({ limit: "20mb" }));
app.use(
  bodyParser.urlencoded({ extended: true, limit: "20mb",  })
);
app.use(
  morgan("dev"),
  cors({
    origin: "*",
    // methods:"GET,POST,PUT,DELETE"
  }),
  rateLimit(),
  // authMiddleware
);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type,Accept, Authorization, Content-Length, X-Requested-With,Origin"
//   );
//   if ("OPTIONS" == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// });
// testing server
app.get("/api", (req, res) => res.send("QURILISH_APP  API"));

// all routes
app.use("/api/v1", router);

// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//     origin:"*",
//   })
// );

// error handling
app.use(errorHandler);
app.use(logger);

// static
app.use("/static", express.static(path.join(__dirname, "public")));

// starting server
app.listen(PORT, async () => {
  console.log(`server ready on port:${PORT}`);
});


// require("./src/bot/setup")
