const express = require('express')
const router = express.Router()
const { list, create, show, pay } = require('./controller')

router.get('/', list)
router.get('/:id', show)
router.post('/', create)
router.post('/:id/payment', pay)
// router.put('/:id', update)
// router.delete('/:id', deleteOne)

module.exports = router
