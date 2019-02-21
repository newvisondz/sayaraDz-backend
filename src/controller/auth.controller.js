const FabricantUser = require("../model/fabricant.user.model");
const JwtToken = require("../model/jwt.blacklist");
const authController = require("./permission.controller");


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


module.exports = {login, logout};