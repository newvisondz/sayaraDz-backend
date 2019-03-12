const express = require('express')
const router = express.Router()
const { login, logout } = require('../../services/auth')
const { index, create, deleteOne, update } = require('./controller')

router.post('/login', login('local-manufacturer'))
router.delete('/logout', logout)

router.get('/', index)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)

module.exports = router
