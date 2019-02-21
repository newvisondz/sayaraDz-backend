const authController = require("./permission.controller");

function index() {
    return [
        authController.isFabricantAdmin,
        (req, res)=>res.json(req.user)
    ]
}

module.exports = {index}