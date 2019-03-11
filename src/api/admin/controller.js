const {isAdmin} = require("../../services/acl")

exports.index = () => [
    isAdmin,
    (req, res) => {
        res.json(req.user)
    }
]

exports.current = () => [
    isAdmin,
    (req, res) => {
        res.json(req.user)
    }
]