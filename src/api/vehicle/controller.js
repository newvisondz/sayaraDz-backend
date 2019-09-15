const http = require('../../services/http')
const Vehicle = require('./model')
const crud = require('../../services/crud')(Vehicle, 'vehicle')
const query = require('querymen').middleware
const { upload, deleteImages } = require('../../services/upload')
const { getTotalPrice } = require('../tarifs/resolvers')
const Command = require('../command/model')

const { findById, retrievedOptions, filterById } = require('../utils')

exports.read = [
  query(Vehicle.querySchema()),
  async ({ model, version, querymen: { query: match, select, cursor: options } }, res, next) => {
    try {
      delete options.sort
      const count = version.vehicles.length
      await model.populate({
        path: 'versions.vehicles',
        match,
        select,
        options
      }).execPopulate()
      await http.ok(res, {
        vehicles: version.vehicles.map(
          v => ({
            ...v.toJSON(),
            color: findById(v.color, model.colors),
            options: retrievedOptions(filterById(v.options, model.options))
          })
        ),
        count
      })
      next()
    } catch (error) {
      await http.internalError(res)
      next(error)
    }
  }
]
exports.show = [
  query(Vehicle.querySchema()),
  checkVehicle,
  async ({ model, params: { id }, querymen: { select } }, res, next) => {
    try {
      const vehicle = await Vehicle.findById(id).select(select)
      http.ok(res, {
        ...vehicle.toJSON(),
        color: findById(vehicle.color, model.colors),
        options: retrievedOptions(filterById(vehicle.options, model.options))
      })
    } catch (error) {
      http.internalError(res, error)
    }
  }
]
exports.create = [
  async (req, res, next) => {
    upload.array('images')(req, res, async (error) => {
      try {
        if (error) return http.internalError(res, error)
        const { version, model, body: { color } } = req
        const newOptions = version.options
        if (verifyOptionColors(res, color || undefined, version.colors, newOptions, version.options)) {
          return
        }
        const { files, body } = req
        body.images = files && files.map(
          image => '/public/' + image.filename
        )
        body.version = version.id
        body.manufacturer = req.manufacturer.id
        delete body.sold
        delete body.ordered
        const vehicle = await new Vehicle(body).save()
        version.vehicles.push(vehicle.id)
        await model.save()
        http.ok(res, vehicle)
        next()
      } catch (error) {
        http.badRequest(res, error)
        next(error)
      }
    })
  }
]

// exports.update = [
//   checkVehicle,
//   (req, res, next) => {
//     upload.array('newImages')(req, res, async error => {
//       if (error) return http.internalError(res, error)
//       const { version, body: { color, options: newOptions } } = req
//       if (verifyOptionColors(res, color || undefined, version.colors, newOptions, version.options)) {
//         return
//       }
//       const { files, body } = req
//       if (files && files.length) {
//         try {
//           const vehicle = await Vehicle.findById(req.params.id)
//           body.images = mergeImageBody(files, body.images, vehicle.images)
//           await deleteImages(without(vehicle.images, body.images))
//           vehicle.set(body)
//           await vehicle.save()
//           await http.ok(res, {
//             nModified: 1,
//             ok: 1,
//             n: 1,
//             images: body.images
//           })
//         } catch (error) {
//           http.badRequest(res, error)
//         }
//       } else {
//         try {
//           body.images = body.images && JSON.parse(body.images)
//           next()
//         } catch (error) {
//           http.badRequest(res, {
//             error: 1,
//             msg: 'images field is not valid json string'
//           })
//         }
//       }
//     })
//   },
//   crud.findAndUpdate
// ]

exports.deleteOne = [
  checkVehicle,
  crud.deleteOne,
  async ({ deleted, model, version, params: { id } }, res, next) => {
    try {
      await deleteImages(deleted.images)
      version.vehicles.remove(id)
      await model.save()
      next()
    } catch (error) {
      next(error)
    }
  }
]

async function checkVehicle ({ version, params: { id } }, res, next) {
  const includes = version.vehicles.find(
    vehicle => vehicle == id
  )
  if (includes) return next()
  http.notFound(res, {
    error: true,
    msg: 'vehicle not found'
  })
}

function verify (array1, array2) {
  for (let item1 of array1) {
    if (array2.find(
      i => i == item1
    )
    ) continue
    else return item1
  }
}

function verifyOptionColors (res, color, colors, newOptions, options) {
  if (color) {
    if (verify([color], colors)) {
      http.badRequest(res, {
        error: true,
        msg: 'color not found'
      })
      return true
    }
  }
  if (newOptions) {
    if (verify(newOptions, options)) {
      http.badRequest(res, {
        error: true,
        msg: 'option not found'
      })
      return true
    }
  }
}

exports.check = async ({ user, version, query: { color } }, res) => {
  try {
    console.log('options ... ', version.options)
    const vehicles = color
      ? await Vehicle.find({ color, version: version.id, sold: false, ordered: false }, '_id')
      : await Vehicle.find({ version: version.id, sold: false, ordered: false }, '_id')

    if (!vehicles.length) {
      return { vehicles }
    }
    const commands = await Command.find({ automobiliste: user.id })

    let vIds = vehicles.map(v => v.id + '')
    const vehiclesCmds = commands.map(c => c.vehicle)
    vIds = vIds.filter(
      id => !vehiclesCmds.find(
        vcmd => vcmd == id
      )
    )
    console.log({ vehicles, vIds, vehiclesCmds })
    res.json(
      {
        vehicles: vIds,
        tarif: await getTotalPrice(([...version.options, color].filter(v => !!v)))
      }
    )
  } catch (error) {
    console.log(error)
    http.badRequest(res, error)
  }
}

exports.compose = async ({ query: { options = [], color } }, res) => {
  try {
    console.log({ options })
    const vehicles = color
      ? await Vehicle.find({
        color,
        options: {
          $all: options
        }
      }, '_id')
      : await Vehicle.find({
        options: {
          $all: options
        }
      }, '_id')
    console.log({ vehicles })
    if (!vehicles.length) {
      return res.json({ vehicles })
    }
    res.json(
      {
        vehicles: vehicles.map(v => v.id),
        tarif: await getTotalPrice(([...options, color].filter(v => !!v)))
      }
    )
  } catch (error) {
    console.error(error)
    http.badRequest(res)
  }
}
