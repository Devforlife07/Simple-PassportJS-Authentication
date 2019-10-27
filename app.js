const express = require("express");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
let indexPath = require("./router/index");
const mongoose = require("mongoose");
const key = require("./config/key").mongoURI;
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
//Express Session
app.use(
  session({
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
//Routes
app.use("/", indexPath);
app.use("/users", require("./router/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
