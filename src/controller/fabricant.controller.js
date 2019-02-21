const permissionController = require("./permission.controller");

function index() {
    return [
        permissionController.isFabricant,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

function current() {
    return [
        permissionController.isFabricant,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

module.exports = {index, current};