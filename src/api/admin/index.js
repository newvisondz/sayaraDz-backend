const express = require('express')
const router = express.Router()
const { login, logout } = require('../../services/auth')
const { update, me } = require('./controller')
router.post('/login', login('local-admin'))

router.delete('/logout', logout)

router.get('/me', me)
router.put('/me', update)
module.exports = router
