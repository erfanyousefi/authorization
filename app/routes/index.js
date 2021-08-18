const { Router } = require("express");
const router = Router();
const HomeController = require("./../http/controllers/Home");
const AuthRouter = require("./auth");
const DashboardRouter = require("./dashboard");
const Auth = require("./../http/middlewares/Auth")
router.use("/auth", Auth.logined, AuthRouter)
router.use("/dashboard", Auth.notLogin, DashboardRouter)
router.get("/about-us", HomeController.aboutUSPage);
router.get("/whitepaper", HomeController.whitepaperPage);
router.get("/", HomeController.indexPage);
router.get("/logout", HomeController.logout);
module.exports = router