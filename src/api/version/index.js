const router = require('express').Router()
const { read, create, deleteOne, update } = require('./controller')

router.get('/', read)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)

module.exports = router
