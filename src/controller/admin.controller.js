const permissionController = require("./permission.controller");

function index() {
    return [
        permissionController.isAdmin,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}


function current() {
    return [
        permissionController.isAdmin,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

module.exports = {index, current};