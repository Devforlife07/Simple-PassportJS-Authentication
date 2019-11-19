const express = require("express");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
let indexPath = require("./router/index");
const mongoose = require("mongoose");
const key = require("./config/key").mongoURI;
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const app = express();
//Passport Config
require("./config/passport")(passport);
//Connect DB
mongoose
  .connect(key, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
//BodyParser
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
//Express Session
app.use(
  session({
    store: new FileStore(),
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect-Flash
app.use(flash());
//Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
//Routes
app.use("/", indexPath);
app.use("/users", require("./router/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
