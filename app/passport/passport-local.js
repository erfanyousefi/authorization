const Strategy = require("passport-local").Strategy;
const UserModel = require("./../models/user");
const bcrypt = require("bcrypt")
const passport = require("passport");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use("local.login", new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    UserModel.findOne({ email }, (err, user) => {
        console.log(err);
        if (err) {
            return done({
                error: "User could not be found."
            }, null);
        }
        if (user) {

            if (bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done({
                    error: `Incorrect email or password.
                     Enter your sign in information again,
                      or request an email to gain access to your account.`
                }, null);
            }
        } else {
            return done({
                error: "User could not be found."
            }, null);
        }
    });
}))

passport.use("local.register", new Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async(req, email, password, done) => {
    UserModel.findOne({
        email
    }, async(err, user) => {
        if (err) {
            done({
                error: "Sorry, there was a problem. try again"
            }, null);
        }
        if (user) {
            done({
                error: "An account with Email already exist"
            }, null);
        } else {
            if (password === req.body.confirmpassword) {
                let memoCode = await memoGenerator()
                let salt = bcrypt.genSaltSync(15);
                let hash = bcrypt.hashSync(password, salt);
                UserModel.create({
                    name: req.body.name,
                    memoCode,
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
            } else {
                done({
                    error: "The password confirmation does not match."
                }, null);
            }
        }

    })
}));

async function memoGenerator() {
    let memoCode = Math.floor(100000 + Math.random() * 900000)
    let user = await UserModel.findOne({ memoCode });
    if (user) {
        this.memoGenerator()
    } else {
        return memoCode;
    }
}