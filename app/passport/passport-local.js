const Strategy = require("passport-local").Strategy;
const UserModel = require("./../models/user");
const bcrypt = require("bcrypt")
const passport = require("passport");
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use("local.login", new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    UserModel.findOne({ email }, (err, user) => {
        if (err) {
            return done({
                message: "User could not be found."
            }, null);
        } if (user) {

            if (bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done({
                    message: `Incorrect email or password.
                     Enter your sign in information again,
                      or request an email to gain access to your account.`
                }, null);
            }
        } else {
            return done({
                message: "User could not be found."
            }, null);
        }
    });
}))

passport.use("local.register", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    userModel.findOne({
        email
    }, (err, user) => {
        if (err) {
            done({
                error: "Sorry, there was a problem. try again"
            }, null);
        }
        if (user) {
            done({
                error: "That email is taken. Try another"
            }, null);
        } else {
            let salt = bcrypt.genSaltSync(15);
            let hash = bcrypt.hashSync(password, salt);
            userModel.create({
                name: req.body.name,
                email,
                password: hash
            }, (err, user) => {
                if (err) {
                    done({
                        error: "Sorry, there was a problem. try again"
                    }, null);
                }
                if (user) {
                    done(null, user)
                } else {
                    done({
                        error: "Sorry, there was a problem. try again"
                    }, null);
                }
            });
        }
    })
}));