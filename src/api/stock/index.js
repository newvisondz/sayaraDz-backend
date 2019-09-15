const express = require('express')
const router = express.Router()
const { uploadStockFile } = require('./controller')
const { isFabricantAdmin, isFabricant, authenticated } = require('../../services/acl')

router.use('/*', isFabricant, isFabricantAdmin, authenticated)
router.post('/vehicles', uploadStockFile)
// router.post('/tarifs', uploadTarifs)

module.exports = router
