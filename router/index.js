const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../config/auth").ensureAuthenticated;
//Welcome Page
router.get("/", (req, res) => {
  res.render("welcome");
});
//Dashboard Route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  req.flash("success_msg", "You Are Successfully Logged In");
  res.render("dashboard", {
    user: req.user.name
  });
});
module.exports = router;
