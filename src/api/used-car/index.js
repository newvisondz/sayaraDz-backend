const router = require('express').Router()
const { isAutomobiliste, authenticated } = require('../../services/acl/')
const { create, list, destroy } = require('./controller')

router.use([
  isAutomobiliste,
  authenticated
])

router.get('/', list)
router.post('/', create)
router.delete('/:id', destroy)

module.exports = router
