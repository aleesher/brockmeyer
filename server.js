const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const morgan = require("morgan");

require("dotenv").config({
  path: process.env.ENV_FILE || "./.env"
});

const api = require("./api/routes/");
const auth = require("./api/routes/auth");
const passport = require("./passport");
const cookieParser = require("cookie-parser");

const app = express();
const DAY = 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";
const maxAge = isProduction ? DAY : 0;
const mode = isProduction ? "production" : "develop";
const port = process.env.PORT || 3001;
const staticFolder = isProduction ? "./build" : "./public";

app.use(morgan("combined"));
app.use(cookieParser());

const opts = {
  secret: "peppa-pig",
  proxy: true,
  resave: true,
  maxAge: DAY,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: maxAge
  })
};

app.use(session(opts));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(staticFolder, { maxAge }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", auth);
app.use("/api", api);
app.use("*", express.static(staticFolder, { maxAge }));

app.listen(port, () => {
  console.info(`Server running on ${mode} mode.`);
  console.info(`Listening on port ${port}`);
});

app.on("error", err => console.error(err));

module.exports = app;
