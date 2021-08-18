const autoBind = require("auto-bind");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const UserModel = require("./../../models/user")
module.exports = class Controller {
    constructor() {
        autoBind(this)
    }
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(15);
        const hashed = bcrypt.hashSync(password, salt);
        return hashed
    }
    setCookie(res, token1) {
        res.cookie("user-token", token1, { signed: true, httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 6)) })
            // res.cookie("refresh-token", this.refreshTokenGenerator(), { signed: true, httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 6)) })
    }
    jwtGenerator(id, email) {
        const token = jwt.sign({ id, email }, `${process.env.JWT_SECRET}`, { expiresIn: Date.now() + (1000 * 60 * 60 * 24 * 6), algorithm: "HS256" });
        return token
    }
    refreshTokenGenerator() {
        return uuidv4()
    }
    async verifyJWTToken(token) {
        return jwt.verify(token, `${process.env.JWT_SECRET}`, { algorithms: "HS256" });
    }
    errorHandler(errors, errorList) {
        Object.values(errors).forEach(err => {
            errorList[err.param] = err.msg;
        })
    }
    async memoGenerator() {
        let memoCode = Math.floor(100000 + Math.random() * 900000)
        let user = await UserModel.findOne({ memoCode });
        if (user) {
            this.memoGenerator()
        } else {
            return memoCode;
        }
    }
}