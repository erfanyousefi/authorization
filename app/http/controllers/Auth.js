const Controller = require("./Controller");
const passport = require("passport");
class Auth extends Controller {
    loginProcess(req, res, next) {

    }
    login(req, res, next) {
        passport.authenticate("local.login", {
            passReqToCallback: true
        }, (err, user) => {
            if (err) {
                //error handler
                res.redirect("/auth/login");
            }
            if (user) {
                req.login(user, err => {
                    if (err) {
                        //error handler
                        res.redirect("/login");
                    }
                    if (user) {
                        //login process ....
                        res.redirect("/");
                    }
                })
            }
        })(req, res, next)
    }
    registerProcess(req, res, next) {

    }
    registerPassport() {
        passport.authenticate("local.register", (err, user) => {
            if (err) {
                if (err.error) {
                    //error handler....
                    res.redirect("/register");
                }
            }
            if (user) {
                let message = `Thanks for signing up. Welcome to our community.`;
                //signup process ....
                res.redirect("/register");
            }
        })(req, res, next)
    }
}
module.exports = new Auth();