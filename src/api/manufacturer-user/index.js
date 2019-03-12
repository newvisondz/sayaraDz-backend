const express = require('express')
const router = express.Router()
const { login, logout } = require('../../services/auth')

router.post('/login', login('local-manufacturer'))

router.delete('/logout', logout)

module.exports = router
