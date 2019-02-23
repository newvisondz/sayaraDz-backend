const permissionController = require("./permission.controller");
const Fabricant = require("../model/fabricant.user.model");

function index() {
    return [
        permissionController.isFabricantAdmin,
        (req, res) => {

            const query = Fabricant.getQueryObject(req.query);
            Fabricant.find(query)
                .limit(req.query.limit)
                .sort("createdOn")
                .then(fabricants=> res.json(fabricants))
                .catch(err=> res.json(err))
        }
    ]
}
function current() {
    return [
        permissionController.isFabricant,
        (req, res) => {
            res.json(req.user)
        }
    ]
}

module.exports = {index, current};