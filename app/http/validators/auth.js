const { body, check } = require("express-validator")

class AuthValidator {
    register() {
        return [
            body("name").notEmpty().withMessage("this field is required"),
            body("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
            body("password").isLength({ min: 6, max: 16 }).withMessage("The password must be at 6 - 16 characters long"),
            body("confirmpassword").custom((value, { req }) => {
                if (req.body.password !== value) {
                    throw new Error("The password confirmation does not match")
                }
                return true
            }),
        ]
    }
    login() {
        return [
            body("email").normalizeEmail().isEmail().withMessage("Invalid Email"),
            body("password").isLength({ min: 6, max: 16 }).withMessage("The password must be at 6 - 16 characters long"),
        ]
    }
}
module.exports = new AuthValidator()