const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, defualt: "" },
    memoCode: { type: String, default: "" },
    wallet: { type: String, default: undefined },
}, {
    timestamps: true
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel