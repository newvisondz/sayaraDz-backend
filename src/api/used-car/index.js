const router = require('express').Router()
const { isAutomobiliste, authenticated } = require('../../services/acl/')
const { create, list, destroy } = require('./controller')
const Model = require('./model')
const { notFound } = require('../../services/http')
const { createNotFoundError } = require('../utils')
const bid = require('./bid')

router.use([
  isAutomobiliste,
  authenticated
])

router.use('/:id/bids', async (req, res, next) => {
  const { params: { id } } = req
  try {
    const usedCar = await Model.findById(id)
    if (!usedCar) {
      return notFound(res, createNotFoundError('Used car', id))
    }
    req.usedCar = usedCar.id
    next()
  } catch (error) {
    return notFound(res, createNotFoundError('Used car', id))
  }
})

router.get('/', list)
router.post('/', create)
router.delete('/:id', destroy)
router.use('/:id/bids', bid)

module.exports = router
