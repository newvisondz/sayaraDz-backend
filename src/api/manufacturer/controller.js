const query = require('querymen').middleware
const { isAdmin, isAutomobiliste, authenticated, isFabricantAdmin } = require('../../services/acl')
const Manufacturer = require('./model')
const fs = require('fs-extra')
const crud = require('../../services/crud')(Manufacturer, 'manufacturer')
const { timestamps } = require('../../services/validation')
const http = require('../../services/http')
const { USER_TYPE: { ADMIN } } = require('../utils')
const { upload, deleteImages } = require('../../services/upload')
const { upload_dir: uploadDir } = process.env

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
  async (req, res, next) => {
    upload.single('logo')(req, res, async (err) => {
      if (err) return http.internalError(res, err)
      const { file, body, params: { id } } = req
      const manufacturer = await Manufacturer.findById(id)
      if (file) {
        if (!manufacturer) {
          return http.notFound(res, {
            error: true,
            msg: 'manufacturer not found'
          })
        }
        fs.unlink(uploadDir + '/' + manufacturer.logo, async (error) => {
          const logo = `public/${file.filename}`
          const result = await Manufacturer.updateOne({ _id: id }, {
            ...body,
            logo
          })
          http.ok(res, {
            ...result,
            logo
          })
          if (error) {
            next(err)
          }
        })
      } else {
        if (req.body.logo === '') {
          fs.unlink(uploadDir + '/' + manufacturer.logo, async (error) => {
            if (!error) next()
          })
        }
        next()
      }
    })
  },
  crud.update
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  crud.deleteOne,
  ({ deleted }, res, next) => {
    if (!deleted) return next()
    // fs.unlink(uploadDir + '/' + deleted.logo, (err) => {
    //   if (err) return next(err)
    //   next()
    // })
    deleteImages([deleted.logo])
  }
]

exports.createWithLogo = [
  isAdmin,
  authenticated,
  async (req, res, next) => {
    upload.single('logo')(req, res, async (err) => {
      if (err) return http.badRequest(res, err)
      req.file && (req.body.logo = `public/${req.file.filename}`)
      next()
    })
  },
  crud.create
]

exports.findManufacturer = async (req, res, next) => {
  const { manufacturer: id } = req.params
  const manufacturer = await Manufacturer.findById(id)
  req.manufacturer = manufacturer
  if (manufacturer)next()
  else {
    http.notFound(res, {
      error: true,
      msg: 'manufacturer not found'
    })
  }
}
