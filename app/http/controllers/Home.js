const Controller = require("./Controller");
let errorList = {}
class HomeController extends Controller {
    indexPage(req, res, next) {
        res.render("./pages/index", {
            messages: errorList
        })
    }
    aboutUSPage(req, res, next) {
        res.render("./pages/about-us", {
            messages: errorList
        })
    }
    whitepaperPage(req, res, next) {
        res.render("./pages/whitepaper", {
            messages: errorList
        })
    }
    logout(req, res, next) {
        req.user.token = "";
        req.user.save();
        res.clearCookie('user-token')
        req.logout()
        res.redirect("/auth/login")
    }
}
module.exports = new HomeController();