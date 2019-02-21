const permissionController = require("./permission.controller");

function index() {
    return [
        permissionController.isFabricantAdmin,
        (req, res)=>res.json(req.user)
    ]
}

module.exports = {index};