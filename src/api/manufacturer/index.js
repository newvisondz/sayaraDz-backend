const express = require('express')
const router = express.Router()
const { index, create, deleteOne } = require('./controller')

router.get('/', index())
router.post('/', create())
router.delete('/:id', deleteOne())
module.exports = router
