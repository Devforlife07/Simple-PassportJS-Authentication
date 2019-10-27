const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//User Model
const User = require("../models/users");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email"
      },
      (email, password, done) => {
        //Match User
        User.findOne({ email: email })
          .then(user => {
            if (!user) return done(null, false, { message: "No User Found" });
          })
          .catch(err => console.log(err));
      }
    )
  );
};
