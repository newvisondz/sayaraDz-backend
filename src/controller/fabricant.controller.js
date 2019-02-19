const User = require("../model/fabricant.model");
const passport = require("passport");
const JwtToken = require("../model/jwt.blacklist");
const authController = require("./auth.controller");

function index() {
    return [
        authController.checkBlackList,
        authController.jwtFabricantAuth
    ]
}

function login(req, res, next) {
    passport.authenticate('fabricant', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                error: 1,
                msg: "invalid credentials"
            });
        }
        res.json(user)

    })(req, res, next);
}

function logout(req, res) {

    const token = new JwtToken({token: req.headers.authorization});
    token.save()
        .then(() => res.json({logout: true}))
        .catch(err => {
            if(err.code == 11000){
                return res.json({logout: false, msg: "already logout"})
            }
            res.json({logout: false, msg: err})
        })
}

function signUp(req, res, next) {

    let user = {password, email, firstName, lastName, address, phone} = req.body;
    user = new User(user);
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

module.exports = {signUp, login, index, logout};