const express = require('express')
const router = new express.Router()

const { show, thumbnail } = require('./controller')

router.get('/:filename', show)
router.get('/:filename/thumb', thumbnail)

module.exports = router
