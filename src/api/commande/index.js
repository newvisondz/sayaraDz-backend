const express = require('express')
const router = express.Router()
const { list, create, show, update, deleteOne, listem } = require('./controller')

router.get('/list/:page', list)
router.get('/:id', show)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', deleteOne)


module.exports = router
