const Controller = require("./Controller");
const passport = require("passport");
const { validationResult } = require("express-validator")
let errorList = {}
class Auth extends Controller {
    loginForm(req, res, next) {
        res.render("./pages/auth/login", {
            messages: errorList
        })
        errorList = {}
    }
    registerForm(req, res, next) {
        res.render("./pages/auth/register", {
            messages: errorList
        })
        errorList = {}
    }
    loginProcess(req, res, next) {
        errorList = {}
        const result = validationResult(req)
        if (result.isEmpty()) {
            this.login(req, res, next);
        } else {
            this.errorHandler(result.errors, errorList)
            res.redirect("/auth/login")
        }
    }
    login(req, res, next) {
        errorList = {}
        passport.authenticate("local.login", {
            passReqToCallback: true
        }, (err, user) => {
            if (err) {
                console.log(err);
                errorList.errorMessage = err.error || "Some thing wnt wrong try again"
                res.redirect("/auth/login");
            }
            if (user) {
                req.login(user, err => {
                    if (err) {
                        //error handler
                        console.log(err);
                        errorList.errorMessage = err.error || "Some thing wnt wrong try again";
                        res.redirect("/auth/login");
                    }
                    if (user) {
                        //login process ....
                        const token = this.jwtGenerator(user._id, user.email);
                        this.setCookie(res, token)
                        user.token = token;
                        user.save();
                        res.redirect("/dashboard");
                    }
                })
            }
        })(req, res, next)
    }
    async registerProcess(req, res, next) {
        errorList = {}
        const result = validationResult(req)
        if (result.isEmpty()) {
            this.registerPassport(req, res, next);
        } else {
            this.errorHandler(result.errors, errorList)
            res.redirect("/auth/register")
        }

    }
    registerPassport(req, res, next) {
        errorList = {}
        passport.authenticate("local.register", (err, user) => {
            console.log(err);
            if (err) {
                errorList.errorMessage = err.error || "Some thing wnt wrong try again"
                res.redirect("/auth/register");
            }
            if (user) {
                //signup process ....
                const token = this.jwtGenerator(user._id, user.email);
                this.setCookie(res, token)
                user.token = token;
                user.save();
                res.redirect("/dashboard");
            }
        })(req, res, next)
    }
}
module.exports = new Auth();