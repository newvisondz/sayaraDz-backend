
const { login, logout } = require('../../services/auth')

exports.login = login('local-admin', 'local-manufacturer')
exports.logout = logout
