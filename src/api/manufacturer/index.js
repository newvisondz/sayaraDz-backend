const express = require('express')
const router = express.Router()
const { read, create, deleteOne, update, createWithLogo } = require('./controller')

router.get('/', read)
router.post('/', create)
router.post('/withlogo', createWithLogo)
router.put('/:id', update)
router.delete('/:id', deleteOne)
module.exports = router
