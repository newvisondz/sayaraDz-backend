const { isAdmin, authenticated, isFabricantAdmin } = require('../../../services/acl')
const ManufacturerUser = require('../user/model')
const query = require('querymen').middleware
const { timestamps } = require('../../../services/validation')
const crud = require('../../../services/crud')(ManufacturerUser, 'manufacturer_amdin', { isAdmin: true })
const http = require('../../../services/http')

exports.read = [
  isAdmin,
  authenticated,
  query({ ...timestamps }),
  middleware,
  async ({ querymen: { query, select, cursor }, manufacturer }, res, next) => {
    try {
      delete query.password
      const result = await ManufacturerUser.find(query, select, cursor)
      const count = await ManufacturerUser.countDocuments(query)
      manufacturer.admins = result
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
  isAdmin,
  isFabricantAdmin,
  authenticated,
  middleware,
  crud.create
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  middleware,
  crud.deleteOne
]
exports.update = [
  isAdmin,
  authenticated,
  middleware,
  crud.findAndUpdate
]

function middleware (req, res, next) {
  const { id: manufacturer } = req.manufacturer

  if (req.querymen) {
    req.querymen.query.manufacturer = manufacturer
    req.querymen.query.isAdmin = true
  }
  req.body.manufacturer = manufacturer
  req.body.isAdmin = true
  next()
}
