const { Router } = require('express')
const { isAutomobiliste, authenticated } = require('../../../services/acl')
const { create, list, destroy } = require('./controller')
const router = new Router()

router.use([
  isAutomobiliste,
  authenticated
])

router.get('/', list)
router.post('/', create)
router.delete('/:id', destroy)

module.exports = router
