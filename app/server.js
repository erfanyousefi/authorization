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
const MongoStore = require("connect-mongo")(session);
const passport = require("passport")
const PORT = process.env.PORT || 8000;
const DB_URL = `${process.env.DB_URL}/${process.env.DB_NAME}`;
const DB_OPTIONS = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}
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
        mongoose.connect(DB_URL, DB_OPTIONS, error => {
            if (!error) {
                console.log("Connect to DB successfuly");
            } else {
                console.log(`Can not connect TO DB`);
                // console.log(error);
            }
        })
    }
    configApplication() {
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
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            }),
            cookie: {
                secure: true
            }
        }));
        app.use(passport.initialize());
        app.use(passport.session())
        app.use(methodOverride("_method"));

    }
    configRoutes() {
        app.use(Routes)
    }
}