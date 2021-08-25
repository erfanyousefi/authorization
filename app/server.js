const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const ExpressEjsLayouts = require("express-ejs-layouts")
require("dotenv").config();
cookieParser("momo-secret");
const Routes = require("./routes/index");
const session = require("express-session");
const passport = require("passport")
const methodOverride = require("method-override")
const Helper = require("./Helpers")
const PORT = process.env.PORT || 8000;
const DB_URL = `${process.env.DB_URL}`;
const DB_OPTIONS = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const Auth = require("./http/middlewares/Auth")
module.exports = class Application {
    constructor() {
        this.configServer();
        this.connectToDB();
        this.configApplication()
        this.configRoutes();
    }
    configServer() {
        const server = http.createServer(app);
        server.listen(PORT, "localhost", () => {
            console.log(`Server run on ${PORT} port...`)
        })
    }
    connectToDB() {
        try {
            mongoose.connect("mongodb+srv://memo_Admin:UNI06jbpczWBD8nD@cluster0.b2c9w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", DB_OPTIONS, error => {
                if (!error) {
                    console.log("Connect to DB successfuly");
                } else {
                    console.log(`Can not connect TO DB`);
                    // console.log(error);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
    configApplication() {
        require("./passport/passport-local")
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static("public"));
        app.use(ExpressEjsLayouts);
        app.set("view engine", "ejs");
        app.set("views", "resource/views");
        app.set("layout extractStyles", true);
        app.set("layout extractScripts", true);
        app.set("layout", "layouts/master")
        app.use(cookieParser("momoSecret"));
        app.set(session({
            secret: "momoSecret",
            resave: true,
            saveUninitialized: true,
            cookie: {
                secure: true
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(methodOverride("_method"));
        app.use((req, res, next) => {
            app.locals = new Helper(req, res).object();
            next();
        })
        app.use(Auth.autoLogin)
    }
    configRoutes() {
        app.use(Routes)
        app.use((req, res, next) => {
            res.locals.layout = "layouts/authMaster"
            res.status(404).render("pages/errors/404", {
                messages: {}
            })
            next()
        })
    }
}