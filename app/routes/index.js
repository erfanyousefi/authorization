const {Router} = require("express");
const router = Router();
const AuthRouter = require("./auth");
router.use(AuthRouter)

module.exports = router