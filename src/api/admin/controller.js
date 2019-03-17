const { isAdmin, authenticated } = require('../../services/acl')

exports.index = [
  isAdmin,
  authenticated,
  (req, res) => {
    res.json(req.user)
  }
]
