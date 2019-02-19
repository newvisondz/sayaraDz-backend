const authController = require("./auth.controller");

function index() {
    return [
        authController.isFabricantAdmin,
        (req, res)=>res.json(req.user)
    ]
}

module.exports = {index}