const Controller = require("./Controller");
const UserModel = require("./../../models/user")
let errorList = {}
class DashboardController extends Controller {
    indexPage(req, res, next) {
        res.render("./pages/dashboard/index", {
            messages: errorList,
            user: req.user
        })
        errorList = {}
    }
    async saveWallet(req, res, next) {
        const wallet = req.body.wallet.toString().trim();
        if (wallet.length > 25) {
            await UserModel.findByIdAndUpdate(req.user._id, { wallet }, (err, user) => {
                if (user) {
                    errorList.successMessage = "Save! Wallet ID Successful"
                } else {
                    errorList.errorMessage = "Wallet ID not saved Please try again"
                }
            })
        } else {
            errorList.errorMessage = "Invalid Wallet ID"
        }
        res.redirect("/dashboard")
    }
}

module.exports = new DashboardController();