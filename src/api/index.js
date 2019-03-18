const { Router } = require('express')
const admin = require('./admin')
const manufacturer = require('./manufacturer')
const oauth = require('./auth')
const automobiliste = require('./automobiliste')
const me = require('./me')
const router = new Router()
const querymen = require('querymen')

router.use('/admins', admin)
router.use('/autom', automobiliste)
router.use('/manufacturers', manufacturer)
router.use('/auth', oauth)
router.use('/me', me)
router.use(querymen.errorHandler())

module.exports = router
