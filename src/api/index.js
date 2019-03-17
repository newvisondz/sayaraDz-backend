const { Router } = require('express')

const admin = require('./admin')
const manufacturer = require('./manufacturer')
const oauth = require('./auth')
const automobiliste = require('./automobiliste')
const router = new Router()
const querymen = require('querymen')

router.use('/admin', admin)
router.use('/autom', automobiliste)
router.use('/manufacturer', manufacturer)
router.use('/auth', oauth)
router.use(querymen.errorHandler())

module.exports = router
