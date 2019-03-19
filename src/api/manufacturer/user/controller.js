const { authenticated, isFabricantAdmin } = require('../../../services/acl')
const ManufacturerUser = require('./model')
const crud = require('../../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: false })
const query = require('querymen').middleware
const { timestamps } = require('../../../services/validation')
const http = require('../../../services/http')

exports.read = [
  isFabricantAdmin,
  authenticated,
  query({ ...timestamps }),
  middleware,
  async ({ querymen: { query, select, cursor }, manufacturer }, res, next) => {
    try {
      delete query.password
      const result = await ManufacturerUser.find(query, select, cursor)
      const count = await ManufacturerUser.countDocuments(query)
      manufacturer.users = result
      http.ok(res, {
        manufacturer,
        count
      })
    } catch (error) {
      res.json(error)
      next(error)
    }
  }
]

exports.create = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.create
]

exports.update = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.findAndUpdate
]

exports.updateMe = [
  isFabricantAdmin,
  authenticated,
  middleware,
  (req, res, next) => {
    delete req.body.isAdmin
    req.params.id = req.user.id
    next()
  },
  crud.update
]

exports.deleteOne = [
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.deleteOne
]

function middleware (req, res, next) {
  const { id: manufacturer } = req.manufacturer
  if (manufacturer != req.user.manufacturer) {
    return http.unauthorized(res, {
      error: true,
      msg: 'permission denied'
    })
  }
  if (req.querymen) {
    req.querymen.query.manufacturer = manufacturer
    req.querymen.query.isAdmin = false
  }
  req.body.manufacturer = manufacturer
  req.body.isAdmin = false
  next()
}
