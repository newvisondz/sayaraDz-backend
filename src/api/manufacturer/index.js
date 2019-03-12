const express = require('express')
const router = express.Router()
const { read, create, deleteOne, update } = require('./controller')

router.get('/', read)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', deleteOne)
module.exports = router
