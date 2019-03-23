const { isFabricant, isFabricantAdmin, authenticated } = require('../../services/acl')
const Model = require('./model')
const http = require('../../services/http')
const crud = require('../../services/crud')(Model, 'model')
const querymen = require('querymen').middleware
const { timestamps } = require('../../services/validation')

exports.read = [
  isFabricant,
  isFabricantAdmin,
  querymen({
    ...timestamps,
    name: {
      type: String
    }
  }),
  async ({ manufacturer }, res, next) => {
    await manufacturer.populate('models').execPopulate()
    res.json({ manufacturer })
  }
]

exports.create = [
  isFabricant,
  isFabricantAdmin,
  authenticated,
  checkUser,
  crud.create,
  async (req, res, next) => {
    req.manufacturer.models.push(req.created.id)
    try {
      await req.manufacturer.save()
    } catch (error) {
      next(error)
    }
  }
]

exports.update = [
  isFabricant,
  isFabricantAdmin,
  checkModel,
  crud.findAndUpdate
]

exports.deleteOne = [
  isFabricant,
  isFabricantAdmin,
  checkModel,
  crud.deleteOne,
  async ({ manufacturer, modelIndex, params: { id } }, res, next) => {
    manufacturer.models.remove(id)
    await manufacturer.save()
    next()
  }
]

function checkUser (req, res, next) {
  const { id: manufacturer } = req.manufacturer
  console.error(req.user)
  if (manufacturer != req.user.manufacturer) {
    return http.unauthorized(res)
  }
  next()
}

function checkModel (req, res, next) {
  const { manufacturer: { models }, params: { id } } = req
  const index = models.indexOf(id)
  if (index !== -1) return next()
  req.modelIndex = index
  http.notFound(res, {
    error: true,
    msg: 'model not found'
  })
}
