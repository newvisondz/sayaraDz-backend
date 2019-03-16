const { isAdmin, authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('../manufacturer-user/model')
const Validation = require('../../services/validation')
const query = require("querymen").middleware
const {timestamps} = require('../../services/validation')
const crud = require('../../services/crud')(ManufacturerUser, 'manufacturer_amdin', { isAdmin: true })
const validate = new Validation(ManufacturerUser.schema)

exports.read = [
  isAdmin,
  authenticated,
  query({...timestamps}),
  queryAdmin,
  crud.read
]

exports.readof = [
  isAdmin,
  authenticated,
  query({...timestamps}),
  (req, res, next)=>{
    req.querymen.query.manufacturer = req.params.id
    console.log(req.querymen)
    next()
  },
  queryAdmin,
  crud.read
]

exports.create = [
  isAdmin,
  isFabricantAdmin,
  authenticated,
  // validate.requirePaths.bind(validate),
  bodyAdmin,
  crud.create
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  bodyAdmin,
  crud.deleteOne
]
exports.update = [
  isAdmin,
  authenticated,
  validate.filter.bind(validate),
  bodyAdmin,
  crud.update
]

function bodyAdmin (req, res, next) {
  req.body.isAdmin = true
  next()
}
function queryAdmin (req, res, next) {
  req.query.isAdmin = true
  next()
}
