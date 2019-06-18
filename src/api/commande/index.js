const express = require('express')
const router = express.Router()
const { create, show, update, deleteOne} = require('./controller')

router.post('/', create)
router.get('/:id', show)
router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
