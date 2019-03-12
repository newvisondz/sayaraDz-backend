const { authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('../manufacturer-user/model')
const Validation = require('../../services/validation')
const crud = require('../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: false })
const validate = new Validation(ManufacturerUser.schema)

exports.read = [
  isFabricantAdmin,
  authenticated,
  validate.filter.bind(validate),
  queryAdmin,
  crud.read
]

exports.create = [
  isFabricantAdmin,
  authenticated,
  validate.requirePaths.bind(validate),
  bodyAdmin,
  crud.create
]

exports.update = [
  isFabricantAdmin,
  authenticated,
  validate.filter.bind(validate),
  bodyAdmin,
  crud.update
]
exports.deleteOne = [
  isFabricantAdmin,
  authenticated,
  bodyAdmin,
  crud.deleteOne
]
function bodyAdmin (req, res, next) {
  req.body.isAdmin = false
  next()
}
function queryAdmin (req, res, next) {
  req.query.isAdmin = false
  next()
}
