const authController = require("./permission.controller");

function index() {
    return [
        authController.isFabricant,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

function current() {
    return [
        authController.isFabricant,
        (req, res) => {
            const user = req.user.toJSON();
            delete user.token;
            res.json(user)
        }
    ]
}

module.exports = {index, current};