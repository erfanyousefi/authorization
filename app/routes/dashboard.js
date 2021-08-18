const { Router } = require("express")
const router = Router();
router.use((req, res, next) => {
    res.locals.layout = "layouts/dashboardMaster"
    next();
})
const Dashboardontroller = require("../http/controllers/Dashboard")
router.get("/", Dashboardontroller.indexPage)
module.exports = router;