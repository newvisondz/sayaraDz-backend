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
  async ({ manufacturer, querymen: { query, select, cursor: options } }, res, next) => {
    await manufacturer.populate({
      path: 'models',
      match: query,
      select,
      options
    }).execPopulate()
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
  async ({ manufacturer, params: { id } }, res, next) => {
    manufacturer.models.remove(id)
    await manufacturer.save()
    next()
  }
]

function checkUser (req, res, next) {
  const { id: manufacturer } = req.manufacturer
  if (manufacturer != req.user.manufacturer) {
    return http.unauthorized(res)
  }
  next()
}

function checkModel (req, res, next) {
  const { manufacturer: { models }, params: { id } } = req
  const index = models.indexOf(id)
  if (index !== -1) return next()
  http.notFound(res, {
    error: true,
    msg: 'model not found'
  })
}

exports.checkModel = checkModel
