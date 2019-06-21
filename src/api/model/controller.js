const { isFabricant, isFabricantAdmin, isAutomobiliste, authenticated } = require('../../services/acl')
const Model = require('./model')
const http = require('../../services/http')
const crud = require('../../services/crud')(Model, 'model')
const querymen = require('querymen').middleware
const { timestamps } = require('../../services/validation')
const { checkUser } = require('../../services/validation')
const { storedOptions, USER_TYPE: { AUTOMOBILISTE } } = require('../utils')
const { createImages, updateImages, deleteImages } = require('../../services/upload')
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
      select: '-versions ',
      options
    }).execPopulate()
    http.ok(res, {
      models: manufacturer.models,
      count
    })
  }
]

exports.show = [
  checkModel,
  async ({ params: { id } }, res, next) => {
    const model = await Model.findById(id).select('-versions')
    http.ok(res, model)
  }
]

exports.create = [
  (req, res, next) => {
    createImages(req, res)
      .then(images => {
        req.body.images = images
        next()
      })
      .catch((error) => {
        console.log(error)
        http.internalError(res, {
          error,
          msg: 'upload failed'
        })
      })
  },
  async ({ body: { options = '[]', colors = '[]' }, body }, res, next) => {
    body.options = []
    try {
      body.options = storedOptions(JSON.parse(options))
      body.colors = JSON.parse(colors)
      next()
    } catch (error) {
      console.log(error)
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
  async (req, res, next) => {
    let { params: { id } } = req
    let model = await Model.findById(id)
    if (!model) {
      return http.notFound(res, {
        error: true,
        msg: 'model not found'
      })
    }
    updateImages(req, res, model.images || [])
      .then(async images => {
        let { body, body: { options, colors } } = req
        if (colors) body.colors = JSON.parse(colors)
        if (images) body.images = images || []
        if (options) {
          options = JSON.parse(options)
          body.options = storedOptions(options)
        }
        model.set(body)
        await model.save()
        http.ok(res, {
          images,
          ok: true,
          nModified: 1,
          n: 1
        })
      })
      .catch((error) => {
        console.log(error)
        http.internalError(res, { error, msg: 'internal error' })
      })
  }
]

exports.deleteOne = [
  checkModel,
  crud.deleteOne,
  async ({ deleted, manufacturer, params: { id } }, res, next) => {
    manufacturer.models.remove(id)
    await deleteImages(deleted.images)
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
    console.log('middle ware ....')
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
