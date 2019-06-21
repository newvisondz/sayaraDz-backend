const { Router } = require('express')
const { create, update, destroy, list, show } = require('./controller')

const router = new Router()

router.get('/:id', list)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', destroy)

module.exports = router
