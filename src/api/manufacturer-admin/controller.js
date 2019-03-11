const permissionController = require("../../services/acl");
const FabricantUser = require("../manufacturer-user/model").Model
const ObjectId = require("mongoose").Types.ObjectId;

exports.index = () => [
    permissionController.isAdmin,
    async (req, res) => {
        if (!req.query.fabricant) return res.json({
            error: 1,
            msg: "fabricant required"
        })

        const query = FabricantUser.getQueryObject(req.query)
        console.log({
            query
        })
        try {
            const admins = await FabricantUser.find({
                fabricant: query.fabricant,
                isAdmin: true
            })
            res.json({
                admins
            })
        } catch (error) {
            res.json(error)
        }
    }
]

exports.update = () => [
    permissionController.isAdmin,
    async (req, res) => {
        const query = FabricantUser.getQueryObject(req.query)
        const {
            _id
        } = req.params
        if (!handleIdParams(_id, res)) return
        const result = await FabricantUser.updateOne({
            _id
        }, {
            ...query
        })
        res.json(result)
    }
]

exports.delete = () => [
    permissionController.isAdmin,
    async (req, res) => {
        const _id = req.params.id
        if (!handleIdParams(_id, res)) return
        try {
            const result = await FabricantUser.deleteOne({
                _id
            });

            res.json(result)
        } catch (error) {
            res.json(error)
        }
    }
]

function handleIdParams(_id, res) {
    const isValid = ObjectId.isValid(_id);
    if (!isValid) {
        res.json({
            error: true,
            msg: "bad fabricant admin id"
        });
    }
    return isValid
}