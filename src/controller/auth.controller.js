const FabricantUser = require("../model/fabricant.user.model");
const JwtToken = require("../model/jwt.blacklist");
const permissionController = require("./permission.controller");

exports.login = (strategy) => [
    permissionController.checkAuth(strategy, "invalid credentials"),
    permissionController.generateToken,
    (req, res) => {
        res.json(req.user)
    }
]

exports.logout = (req, res) => {
    let token = req.headers.authorization;
    if (!token) return res.json({
        error: true,
        msg: "token validation failed: token is required."
    });
    token = new JwtToken({
        token
    });
    try {
        token.save()
        res.json({
            logout: true
        })
    } catch (error) {
        let logout
        if (err.code == 11000) {
            logout = true
        }
        res.json({
            logout,
            msg: logout ? undefined : error
        })
    }
}