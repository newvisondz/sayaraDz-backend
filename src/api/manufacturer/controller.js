const query = require('querymen').middleware
const uuid = require('uuid/v4')
const { isAdmin, isAutomobiliste, authenticated, isFabricantAdmin } = require('../../services/acl')
const Manufacturer = require('./model')
const fs = require('fs-extra')
const formidable = require('formidable')
const crud = require('../../services/crud')(Manufacturer, 'manufacturer')
const { timestamps } = require('../../services/validation')
const http = require('../../services/http')
const { USER_TYPE: { ADMIN } } = require('../utils')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, './public/images/')
  },
  filename: (req, file, next) => {
    const ext = file.originalname.split('.').pop()
    const name = uuid(file.originalname) + '.' + ext
    next(null, name)
  }
})
const upload = multer({ storage })

exports.read = [
  isAdmin,
  isAutomobiliste,
  authenticated,
  query({
    ...timestamps,
    brand: {
      type: String
    }
  }),
  crud.read
]

exports.create = [
  isAdmin,
  authenticated,
  crud.create
]

exports.update = [
  isAdmin,
  isFabricantAdmin,
  authenticated,
  (req, res, next) => {
    delete req.body.logo
    if (req.user.type == ADMIN) return next()
    if (req.params.id == req.user.manufacturer) return next()
    http.unauthorized(res)
  },
  crud.update
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  crud.deleteOne
]

exports.createWithLogo = [
  isAdmin,
  authenticated,
  async (req, res, next) => {
    upload.single('logo')(req, res, async (err) => {
      if (err) return http.badRequest(res, err)
      req.body.logo = `public/images/${req.file.filename}`
      next()
    })
  },
  crud.create
]

exports.findManufacturer = async (req, res, next) => {
  const { manufacturer: id } = req.params
  const manufacturer = await Manufacturer.findById(id).exec()
  req.manufacturer = manufacturer
  if (manufacturer)next()
  else {
    http.notFound(res, {
      error: true,
      msg: 'manufacturer not found'
    })
  }
}
