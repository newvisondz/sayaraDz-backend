const router = require('express').Router()
const { read, deleteOne, create, show, check } = require('./controller')

router.get('/', read)
router.get('/check', check)
router.get('/:id', show)
router.post('/', create)
// router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
