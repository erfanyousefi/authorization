const Controller = require("./Controller");
let errorList = {}
class DashboardController extends Controller {
    indexPage(req, res, next) {
        res.render("./pages/dashboard/index", {
            messages: errorList,
            user: req.user
        })
    }
}

module.exports = new DashboardController();