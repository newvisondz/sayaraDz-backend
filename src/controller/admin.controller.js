const permissionController = require("./permission.controller")

exports.index = () => [
    permissionController.isAdmin,
    (req, res) => {
        res.json(req.user)
    }
]

exports.current = () => [
    permissionController.isAdmin,
    (req, res) => {
        res.json(req.user)
    }
]