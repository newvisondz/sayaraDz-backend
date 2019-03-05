const permissionController = require("./permission.controller");

exports.index = () => [
    permissionController.isAdmin,
    (req, res) => {
        
    }
]

