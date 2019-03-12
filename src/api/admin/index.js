const express = require('express')
const router = express.Router()
const { index, current } = require('./controller')
const { login, logout } = require('../../services/auth')

router.get('/', index())

router.post('/login', login('local-admin'))

router.delete('/logout', logout)

router.get('/current', current())

module.exports = router
