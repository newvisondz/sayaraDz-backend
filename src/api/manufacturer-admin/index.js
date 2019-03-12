const express = require('express')
const router = express.Router()
const { index, create, deleteOne, update } = require('./controller')

router.get('/', index)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)
module.exports = router
