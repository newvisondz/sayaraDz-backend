const express = require('express')
const router = express.Router()
const { index, deleteOne, update } = require('./controller')

router.get('/', index)
router.delete('/:id', deleteOne)
router.put('/:id', update)
module.exports = router
