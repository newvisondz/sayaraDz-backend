const { authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('../manufacturer-user/model')
const Validation = require('../../services/validation')
const crud = require('../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: false })
const query = require("querymen").middleware
const body = require("bodymen").middleware
const {timestamps} = require('../../services/validation')
const validate = new Validation(ManufacturerUser.schema)

exports.read = [
  isFabricantAdmin,
  authenticated,
  query({...timestamps}),
  queryAdmin,
  crud.read
]

exports.readof = [
  isFabricantAdmin,
  authenticated,
  query({...timestamps}),
  (req, res, next)=>{
    req.querymen.query.manufacturer = req.params.id
    next()
  },
  queryAdmin,
  crud.read
]

exports.create = [
  isFabricantAdmin,
  authenticated,
  //validate.requirePaths.bind(validate),
  bodyAdmin,
  crud.create
]

exports.update = [
  isFabricantAdmin,
  authenticated,
  // validate.filter.bind(validate),
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
