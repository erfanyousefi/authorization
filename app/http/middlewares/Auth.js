const UserModel = require("./../../models/user");

const Controller = require("./../controllers/Controller")
let errorList = {}
class Auth extends Controller {
    notLogin(req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect("/auth/login")
        }
        next();
    }
    logined(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/dashboard")
        }
        next();
    }
    autoLogin(req, res, next) {
        if (!req.isAuthenticated()) {
            if (req.signedCookies["user-token"]) {
                let userToken = req.signedCookies["user-token"];
                if (userToken) {
                    // return true
                    return this.login(userToken, req, next);
                }
            }
            next();
        }
    }
    login(userToken, req, next) {
        this.verifyJWTToken(userToken)
            .then(async result => {
                if (result) {
                    await UserModel.findOne({
                        token: userToken
                    }, (err, user) => {
                        if (err) {
                            console.log(err);
                            next(err);
                        }
                        if (user) {
                            req.login(user, err => {
                                if (err) {
                                    console.log(err);
                                    next(err);
                                }
                                next()
                            })
                        } else {
                            next();
                        }
                    })
                }
            }).catch(err => {
                errorList.errorMessage = "Unable to Auto Login, please try again";
                next(err);
            })
    }
}
module.exports = new Auth();