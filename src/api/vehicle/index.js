const router = require('express').Router()
const { read, deleteOne, update, create } = require('./controller')

router.get('/', read)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
