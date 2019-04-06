const router = require('express').Router()
const { read, show, create, deleteOne, update } = require('./controller')
const http = require('../../services/http')
const vehicle = require('../vehicle')

router.use('/:id', (req, res, next) => {
  const { model, params: { id } } = req
  const version = model.versions.id(id)
  if (version) {
    req.version = version
    return next()
  }
  http.notFound(res, {
    error: true,
    msg: 'version not found'
  })
})
router.get('/:version', show)
router.get('/', read)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)
router.use('/:id/vehicles', vehicle)
module.exports = router
