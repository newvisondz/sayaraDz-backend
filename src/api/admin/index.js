const express = require('express')
const router = express.Router()
const { login, logout } = require('../../services/auth')
const { update } = require('./controller')
router.post('/login', login('local-admin'))

router.delete('/logout', logout)

router.put('/', update)
module.exports = router
