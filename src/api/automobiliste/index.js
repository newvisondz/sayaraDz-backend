const express = require('express')
const router = express.Router()
const { readMe, update } = require('./controller')

router.get('/me', readMe)
router.put('/me', update)
module.exports = router
