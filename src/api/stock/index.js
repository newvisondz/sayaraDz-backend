const express = require('express')
const router = express.Router()
const { uploadStockFile } = require('./controller')

router.get('/', uploadStockFile)

module.exports = router
