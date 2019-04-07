const { isFabricant, isFabricantAdmin, isAutomobiliste, authenticated } = require('../../services/acl')
const Model = require('./model')
const http = require('../../services/http')
const crud = require('../../services/crud')(Model, 'model')
const querymen = require('querymen').middleware
const { timestamps } = require('../../services/validation')
const { checkUser } = require('../../services/validation')
const { storedOptions, USER_TYPE: { AUTOMOBILISTE } } = require('../utils')

exports.read = [
  querymen({
    ...timestamps,
    name: {
      type: String
    }
  }),
  async ({ manufacturer, querymen: { query, select, cursor: options } }, res, next) => {
    const count = manufacturer.models.length
    await manufacturer.populate({
      path: 'models',
      match: query,
      select,
      options
    }).execPopulate()
    http.ok(res, {
      models: manufacturer.models,
      count
    })
  }
]

exports.create = [
  ({ body: { options = [] }, body }, res, next) => {
    body.options = []
    try {
      body.options = storedOptions(options)
      next()
    } catch (error) {
      http.badRequest(res, error)
    }
  },
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
  checkModel,
  ({ body, body: { options } }, res, next) => {
    if (options) body.options = storedOptions(options)
    next()
  },
  crud.findAndUpdate
]

exports.deleteOne = [
  checkModel,
  crud.deleteOne,
  async ({ manufacturer, params: { id } }, res, next) => {
    manufacturer.models.remove(id)
    await manufacturer.save()
    next()
  }
]

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

exports.middleware = [
  isAutomobiliste,
  isFabricant,
  isFabricantAdmin,
  (req, res, next) => {
    const { user, method } = req
    if (user && (user.type == AUTOMOBILISTE)) {
      if (method.toLowerCase() == 'get') {
        return authenticated(req, res, next)
      }
      req.user = undefined
      return authenticated(req, res, next)
    }
    if (req.user) {
      checkUser(req, res, next)
    } else authenticated(req, res, next)
  }
]
