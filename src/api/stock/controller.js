const multer = require('multer')
const { badRequest, created } = require('../../services/http')
const streamifier = require('streamifier')
const path = require('path')
const csv = require('csvtojson/v2')
const extensions = ['.csv']
const storage = multer.memoryStorage()
const Vehicle = require('../vehicle/model')
const mongoose = require('mongoose')
const Model = require('../model/model')
const { createBodySchema } = require('../tarifs/validation')
const Tarif = require('../tarifs')
const joi = require('@hapi/joi')
const _ = require('underscore')

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(path.extname(file.originalname))

    if (!extensions.includes(path.extname(file.originalname))) {
      // eslint-disable-next-line standard/no-callback-literal
      return cb({
        error: true,
        msg: 'file not acceted'
      })
    }
    cb(null, true)
  }
})

exports.uploadStockFile = (req, res, next) => {
  upload.single('stock')(req, res, async (err) => {
    if (err) return badRequest(res, err)
    const session = await mongoose.startSession()

    try {
      const json = await csv().fromStream(streamifier.createReadStream(req.file.buffer))
      const stock = json.map(
        doc => ({
          ...doc,
          manufacturer: req.user.manufacturer,
          color: (doc.color.name && doc.color.value && mongoose.Types.ObjectId()) || undefined
        })
      )
      session.startTransaction()
      const versions = [...new Set(json.map(d => d.version))]
      console.log(req.user.manufacturer)
      const result = await Model.find(
        {
          'versions._id': [...versions],
          manufacturer: req.user.manufacturer
        }).select('versions._id')
      const resultVersions = _.flatten(result.map(
        m => m.versions.map(v => v.id)
      ))

      for (let v of versions) {
        if (!resultVersions.includes(v)) {
          throw new Error()
        }
      }
      const vins = [...new Set(json.map(d => d.vin))]

      if ((vins.length < json.length)) {
        // eslint-disable-next-line no-throw-literal
        throw new Error()
      }
      const data = await Vehicle.insertMany(stock, { session })

      for (let index = 0; index < data.length; index++) {
        const vehicle = data[index]
        if (vehicle.color) {
          await Model.updateOne(
            {
              'versions._id': json[index].version,
              manufacturer: req.user.manufacturer
            },
            {
              $push: {
                colors: {
                  ...json[index].color,
                  _id: vehicle.color
                },
                'versions.$.vehicles': vehicle.id
              }
            }
            , { session }
          )
        }
      }
      session.commitTransaction()
      created(res, {
        success: true
      })
    } catch (error) {
      console.error(error)
      session.abortTransaction()
      badRequest(res, {
        error: true,
        code: 'invalid_data'
      })
    }
  }
  )
}

exports.uploadTarifs = (req, res, next) => {
  upload.single('tarifs')(req, res, async (err) => {
    if (err) return badRequest(res, err)
    const session = await mongoose.startSession()

    try {
      const json = await csv().fromStream(streamifier.createReadStream(req.file.buffer))
      session.startTransaction()
      // const versions = [...new Set(json.filter(d => d.code == 0).map(d => d.version))]
      // const options = [...new Set(json.filter(d => d.code == 1).map(d => d.option))]
      // const colors = [...new Set(json.filter(d => d.code == 2).map(d => d.color))]

      for (let doc of json) {
        await joi.validate(doc, createBodySchema)
      }
      const data = await Tarif.insertMany(json, { session })
      session.commitTransaction()
      created(res, data)
    } catch (error) {
      console.error(error)
      session.abortTransaction()
      badRequest(res, {
        error: true,
        code: 'invalid_data'
      })
    }
  }
  )
}
