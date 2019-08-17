const { Router } = require('express')
const admin = require('./admin')
const manufacturer = require('./manufacturer')
const usedCar = require('./used-car')
const oauth = require('./auth')
const automobiliste = require('./automobiliste')
const command = require('./command')
const me = require('./me')
const router = new Router()
const querymen = require('querymen')
const login = require('./login')
const publicImages = require('./public')

router.use('/', login)
router.use('/admins', admin)
router.use('/autom', automobiliste)
router.use('/commands', command)
router.use('/manufacturers', manufacturer)
router.use('/used-cars', usedCar)
router.use('/auth', oauth)
router.use('/me', me)
router.use(querymen.errorHandler())
router.use('/public', publicImages)

module.exports = router
