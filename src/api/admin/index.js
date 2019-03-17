const express = require('express')
const router = express.Router()
const { index } = require('./controller')
const { login, logout } = require('../../services/auth')

router.get('/', index)

router.post('/login', login('local-admin'))

router.delete('/logout', logout)

module.exports = router
