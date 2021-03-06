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
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) console.log(err);
              if (isMatch) {
                // req.flash("success_msg", "You Are Logged In");
                return done(null, user);
              } else
                return done(null, false, { message: "Password Do Not Match" });
            });
          })
          .catch(err => console.log(err));
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
