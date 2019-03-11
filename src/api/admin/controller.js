const permissionController = require("../../services/acl")

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