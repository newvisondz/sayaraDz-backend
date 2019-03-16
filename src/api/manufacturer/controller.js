const query = require('querymen').middleware
const { isAdmin, isAutomobiliste, authenticated } = require('../../services/acl')
const Manufacturer = require('./model')
const fs = require('fs-extra')
const formidable = require('formidable')
const crud = require('../../services/crud')(Manufacturer, 'fabricant')
const { timestamps } = require('../../services/validation')

exports.read = [
  isAdmin,
  isAutomobiliste,
  authenticated,
  query({ ...timestamps }),
  crud.read
]

exports.create = [
  isAdmin,
  authenticated,
  // validate.requirePaths.bind(validate),
  crud.create
]

exports.update = [
  isAdmin,
  authenticated,
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
