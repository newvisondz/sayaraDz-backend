const router = require('express').Router()
const { create, read, show, deleteOne, update, middleware, showOptions, showColors, addOption } = require('./controller')
const versions = require('../version')
const http = require('../../services/http')
const Model = require('../model/model')
const tarifsRouter = require('../tarifs')

router.use(middleware)

router.use(['/:id/versions', '/:id/tarifs'], async (req, res, next) => {
  const { manufacturer: { models }, params: { id } } = req
  const index = models.indexOf(id)
  if (index !== -1) {
    req.model = await Model.findById(models[index])
    return next()
  }
  http.notFound(res, {
    error: true,
    msg: 'model not found'
  })
})

router.use('/:id/tarifs', tarifsRouter)

router.use('/:id/versions', versions)
router.get('/', read)
router.get('/:id', show)
router.get('/:id/options', showOptions)
router.post('/:id/options', addOption)
router.get('/:id/colors', showColors)
router.post('/', create)
router.delete('/:id', deleteOne)
router.put('/:id', update)

module.exports = router
