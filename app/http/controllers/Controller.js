const autoBind = require("auto-bind");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {v4 : uuidv4} = require("uuid")
module.exports = class Controller {
    constructor() {
        autoBind(this)
    }
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(15);
        const hashed = bcrypt.hashSync(password, salt);
        return hashed
    }
    setCookie(res, token1, token2) {
        res.cookie("user-token", token1, { signed: true, httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 6)) })
        res.cookie("refresh-token", this.refreshTokenGenerator(), { signed: true, httpOnly: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 6)) })
    }
    jwtGenerator(user) {
        const token = jwt.sign({_id, email} = user, `${process.env.JWT_SECRET}`,  { expiresIn: Date.now() + (1000 * 60 * 60 * 24 * 6), algorithm : "HS256" });
        return token
    }
    refreshTokenGenerator(){
        return uuidv4()
    }
    verifyJWTToken(token){
        return jwt.verify(token, `${process.env.JWT_SECRET}`, {algorithms : "HS256"});
    }
    momoGenerator(){
        return "6th length digit"
    }
}