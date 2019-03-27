const query = require('querymen').middleware
const { isAdmin, isAutomobiliste, authenticated, isFabricantAdmin } = require('../../services/acl')
const Manufacturer = require('./model')
const fs = require('fs-extra')
const formidable = require('formidable')
const crud = require('../../services/crud')(Manufacturer, 'manufacturer')
const { timestamps } = require('../../services/validation')
const http = require('../../services/http')
const { USER_TYPE: { ADMIN } } = require('../utils')

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
  (req, res, next) => {
    let form = formidable.IncomingForm()
    form.maxFileSize = 20 * 1024 ** 2
    form.keepExtensions = true
    // form.on('error', console.log)
    form.parse(req, async (err, fields, files) => {
      if (err) res.json(err)
      if (!fields.marque) {
        return res.json({
          error: true,
          msg: 'field marque is required'
        })
      }

      const fab = { marque: fields.marque }
      try {
        let newFab = await new Manufacturer(fab).save()
        if (files.logo) {
          let ext = files.logo.name.split('.').pop()
          const logoPath = `public/images/${newFab.id}.${ext}`
          await fs.copy(files.logo.path, logoPath)
          newFab.logo = logoPath
          newFab = await newFab.save()
        }
        res.json(newFab)
      } catch (error) {
        res.json({
          error: 1,
          msg: 'duplicate manufacturer name'
        })
        next(error)
      }
    })
  }
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
