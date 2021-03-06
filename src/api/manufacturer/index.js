const express = require('express')
const router = express.Router()
const { read, deleteOne, update, createWithLogo, findManufacturer } = require('./controller')
const admin = require('./admin')
const user = require('./user')
const { login, logout } = require('../../services/auth')
const model = require('../model')
const { updatePaymentAccount, updatePaymentExternalAccount } = require('./account')

const commands = require('../command/manufacturer-commands')

router.use(['/:manufacturer/*'], [findManufacturer])
router.use('/:manufacturer/admins', admin)
router.use('/:manufacturer/users', user)
router.use('/:manufacturer/models', model)
router.use('/:manufacturer/commands', commands)

router.post('/login', login('local-manufacturer'))
router.delete('/logout', logout)

router.get('/', read)
router.post('/', createWithLogo)
router.post('/withlogo', createWithLogo)
router.put('/:id', update)
router.put('/:id/payment-account', updatePaymentAccount)
router.put('/:id/external-payment-account', updatePaymentExternalAccount)
router.delete('/:id', deleteOne)

module.exports = router
