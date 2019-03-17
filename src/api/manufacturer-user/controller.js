const { authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('../manufacturer-user/model')
const crud = require('../../services/crud')(ManufacturerUser, 'manufacturer_user', { isAdmin: false })
const query = require('querymen').middleware
const { timestamps } = require('../../services/validation')
const Manufacturer = require('../manufacturer/model')
const http = require('../../services/http')

exports.read = [
  isFabricantAdmin,
  authenticated,
  query({ ...timestamps }),
  queryAdmin,
  crud.read
]

exports.readof = [
  isFabricantAdmin,
  authenticated,
  query({ ...timestamps }),
  (req, res, next) => {
    req.querymen.query.manufacturer = req.params.id
    next()
  },
  queryAdmin,
  readUsers
]

exports.create = [
  isFabricantAdmin,
  authenticated,
  bodyAdmin,
  crud.create
]

exports.update = [
  isFabricantAdmin,
  authenticated,
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
  req.querymen.query.isAdmin = false
  next()
}

async function readUsers ({ params, querymen: { query, select, cursor } }, res, next) {
  try {
    const manufacturer = await Manufacturer.findById(params.id)
    if (!manufacturer) {
      return http.notFound(res, {
        error: true,
        msg: 'Manufacturer not found'
      })
    }
    manufacturer[(query.isAdmin ? 'admins' : 'users')] = await ManufacturerUser.find(query, select, cursor)
    console.log()
    const count = await ManufacturerUser.countDocuments(query)
    res.json({
      manufacturer,
      count
    })
    next()
  } catch (error) {
    res.json(error)
    next(error)
  }
}

exports.readUsers = readUsers
