const {isAdmin, authentified, authenticated} = require("../../services/acl");
const ManufacturerUser = require("../manufacturer-user/model").Model
const ObjectId = require("mongoose").Types.ObjectId;

exports.index = () => [
    isAdmin,
    authenticated,
    async (req, res) => {
        if (!req.query.fabricant) return res.json({
            error: 1,
            msg: "manufacturer required"
        })

        const query = ManufacturerUser.getQueryObject(req.query)
        console.log({
            query
        })
        try {
            const admins = await ManufacturerUser.find({
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
    isAdmin,
    authenticated,
    async (req, res) => {
        const query = ManufacturerUser.getQueryObject(req.query)
        const {
            _id
        } = req.params
        if (!handleIdParams(_id, res)) return
        const result = await ManufacturerUser.updateOne({
            _id
        }, {
            ...query
        })
        res.json(result)
    }
]

exports.deleteOne = () => [
    isAdmin,
    authenticated,
    async (req, res) => {
        const _id = req.params.id
        if (!handleIdParams(_id, res)) return
        try {
            const result = await ManufacturerUser.deleteOne({
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
            msg: "bad manufacturer admin id"
        });
    }
    return isValid
}