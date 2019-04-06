const router = require('express').Router()
const { read, deleteOne, update, create, show } = require('./controller')

router.get('/', read)
router.get('/:id', show)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
