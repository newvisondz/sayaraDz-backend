const express = require('express')
const router = express.Router()
const { readAdmins, readUsers, read, create, deleteOne, update, createWithLogo } = require('./controller')
var querymen = require('querymen');

router.get('/', read)
router.get('/:id/admins', readAdmins)
router.get('/:id/users', readUsers)
router.post('/', create)
router.post('/withlogo', createWithLogo)
router.put('/:id', update)
router.delete('/:id', deleteOne)
router.use(querymen.errorHandler())

module.exports = router
