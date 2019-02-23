const permissionController = require("./permission.controller");

function index() {
    return [
        permissionController.isAdmin,
        (req, res) => {
            res.json(req.user)
        }
    ]
}


function current() {
    return [
        permissionController.isAdmin,
        (req, res) => {
            res.json(req.user)
        }
    ]
}

module.exports = {index, current};