const { isAdmin } = require('../../services/acl')

exports.index = () => [
  isAdmin,
  (req, res) => {
    res.json(req.user)
  }
]
