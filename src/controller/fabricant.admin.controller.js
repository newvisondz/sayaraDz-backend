const Fabricant = require("../model/fabricant.model");
const passport = require("passport");
const JwtToken = require("../model/jwt.blacklist");
const authController = require("./auth.controller");


function index() {
    return [
        authController.isFabricantAdmin,
        (req, res)=>res.json(req.user)
    ]
}

module.exports = {index}