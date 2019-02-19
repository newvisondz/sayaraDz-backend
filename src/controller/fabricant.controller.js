const FabricantUser = require("../model/fabricant.user.model");
const JwtToken = require("../model/jwt.blacklist");
const authController = require("./auth.controller");

function index() {
    return [
        authController.isFabricant,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

function current() {
    return [
        authController.isFabricant,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

function login() {
    return [
        authController.checkFabricantAuth("fabricant", "invalid credentials"),
        (req, res)=> res.json(req.user)
    ]

}

function logout(req, res) {

    const token = new JwtToken({token: req.headers.authorization});
    token.save()
        .then(() => res.json({logout: true}))
        .catch(err => {
            if (err.code == 11000) {
                return res.json({logout: false, msg: "already logout"})
            }
            res.json({logout: false, msg: err})
        })
}

function signUp(req, res, next) {

    let user = {password, email, firstName, lastName, address, phone} = req.body;
    user = new FabricantUser(user);
    user.save()
        .then((newUser) => {
            req.login(newUser, function (err) {
                if (err) {
                    return next(err);
                }
                res.json(newUser);
            });
        })
        .catch((err) => {
            if (err.code === 11000) {
                const error = {
                    error: true,
                    message: "email exists"
                };
                return res.json(error)
            }
            res.json(err);
        })
}

module.exports = {signUp, login, index, logout, current};