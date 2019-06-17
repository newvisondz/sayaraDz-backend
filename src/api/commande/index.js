const express = require('express')
const router = express.Router()
const { create, get } = require('./controller')

router.post('/commande', create)
router.get('/commande', get)

module.exports = router
