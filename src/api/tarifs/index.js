const { Router } = require('express')
const { create, update, destroy, list, total } = require('./controller')

const router = new Router()

router.get('/', total)
router.get('/:id', list)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', destroy)

module.exports = router
