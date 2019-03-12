const express = require('express')
const router = express.Router()
const { read, create, deleteOne, update } = require('./controller')

router.get('/', read)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)
module.exports = router
