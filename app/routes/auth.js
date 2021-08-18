const { Router } = require("express")
const router = Router();
const AuthValidator = require("./../http/validators/auth")
router.use((req, res, next) => {
    res.locals.layout = "layouts/authMaster"
    next();
})
const AuthController = require("./../http/controllers/Auth")
router.get("/login", AuthController.loginForm)
router.get("/register", AuthController.registerForm)
router.post("/login", AuthValidator.login(), AuthController.loginProcess)
router.post("/register", AuthValidator.register(), AuthController.registerProcess)
module.exports = router;