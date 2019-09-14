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
    try {
      const json = await csv().fromStream(streamifier.createReadStream(req.file.buffer))
      const stock = json.map(
        doc => ({
          ...doc,
          manufacturer: 'Suzuku',
          color: (doc.color.name && doc.color.value && mongoose.Types.ObjectId()) || undefined
        })
      )
      const data = await Vehicle.insertMany(stock)
      const versions = [...new Set(json.map(d => d.version))]
      const result = await Model.find(
        {
          'versions._id': [...versions]
        })
        .select({ _id: 1 })
        .lean()
      const vins = [...new Set(json.map(d => d.vin))]
      if ((result.length < versions.length) || (vins.length < json.length)) {
        // eslint-disable-next-line no-throw-literal
        throw {
          error: true,
          code: 'invalid_data'
        }
      }
      for (let index = 0; index < data.length; index++) {
        const vehicle = data[index]
        if (vehicle.color) {
          await Model.updateOne(
            {
              'versions._id': json[index].version
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
          )
        }
      }
      created(res, data)
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
  )
}
