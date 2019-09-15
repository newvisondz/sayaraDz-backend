const router = require('express').Router()
const { read, deleteOne, create, show, check, compose } = require('./controller')

router.get('/', read)
router.get('/check', check)
router.get('/compose', compose)
router.get('/:id', show)
router.post('/', create)
// router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
