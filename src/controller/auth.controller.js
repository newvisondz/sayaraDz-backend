const FabricantUser = require("../model/fabricant.user.model");
const JwtToken = require("../model/jwt.blacklist");
const permissionController = require("./permission.controller");

function login(strategy) {
    return [
        permissionController.checkAuth(strategy, "invalid credentials"),
        permissionController.generateToken,
        (req, res)=> {
            res.json(req.user)
        }
    ]
}

function logout(req, res) {
    let token =  req.headers.authorization;
    if(!token)return res.json({
        error: true,
        msg: "token validation failed: token is required."
    });
    token = new JwtToken({token});
    token.save()
        .then(() => res.json({logout: true}))
        .catch(err => {
            if (err.code == 11000) {
                return res.json({logout: true})
            }
            res.json({logout: false, msg: err})
        })
}


module.exports = { login, logout};