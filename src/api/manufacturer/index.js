const express = require('express')
const router = express.Router()
const { read, create, deleteOne, update, createWithLogo, findManufacturer } = require('./controller')
const admin = require('./admin')
const user = require('./user')
const { login, logout } = require('../../services/auth')
const model = require('../model')

router.use(['/:manufacturer/*'], [findManufacturer])
router.use('/:manufacturer/admins', admin)
router.use('/:manufacturer/users', user)
router.use('/:manufacturer/models', model)

router.post('/login', login('local-manufacturer'))
router.delete('/logout', logout)

router.get('/', read)
router.post('/', createWithLogo)
router.post('/withlogo', createWithLogo)
router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
