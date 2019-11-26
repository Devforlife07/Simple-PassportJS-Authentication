const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
//User Model
const User = require("../models/users");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});
//Handle Register Form Links
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //  Check Required Fields
  if (!name || !password || !email || !password2)
    errors.push({ message: "Please Fill In The Required Fields" });
  //Checking For Passwords
  if (password != password2) errors.push({ message: "Password Do Not Match" });
  //Check Password Length
  if (password.length < 6)
    errors.push({ message: "Password Should Be Atleast 6 characters long" });
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  }
  //Validation Pass
  else {
    User.findOne({
      email: email
    }).then(user => {
      console.log(user);
      if (user) {
        //User Exists
        errors.push({ message: "Email Is Already Registered Try Logging In" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password
        });
        //Hash The Password
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) throw err;
            newUser.password = hash;
            // console.log(newUser.password);
            newUser
              .save()
              .then(user => {
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                res.redirect("/users/register");
              });
          });
        });
      }
    });
  }
});
router.post("/register/data", (req, res) => {
  if (req.body) {
    res.json(req.body);
  } else res.json("Error");
});
//POST Login User
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});
//Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  // req.flash("success_msg", "You Are Successfully Logout");
  res.redirect("/users/login");
});
module.exports = router;
