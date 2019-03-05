const permissionController = require("./permission.controller");

exports.index = () => [
    permissionController.isFabricantAdmin,
    (req, res) => res.json(req.user)
]