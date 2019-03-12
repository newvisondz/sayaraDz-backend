const express = require('express')
const router = express.Router()
const { login, logout } = require('../../services/auth')
const { read, create, deleteOne, update } = require('./controller')

router.post('/login', login('local-manufacturer'))
router.delete('/logout', logout)

router.get('/', read)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)

module.exports = router
