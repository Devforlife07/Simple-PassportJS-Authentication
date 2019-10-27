const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
let indexPath = require("./router/index");
const mongoose = require("mongoose");
const key = require("./config/key").mongoURI;
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
//Routes
app.use("/", indexPath);
app.use("/users", require("./router/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started on port " + PORT);
});
