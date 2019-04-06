const http = require('../../services/http')
const Vehicle = require('./model')
const crud = require('../../services/crud')(Vehicle)
const query = require('querymen').middleware
const upload = require('../../services/upload')
const fs = require('fs')

exports.read = [
  query(Vehicle.querySchema()),
  async ({ model, version, querymen: { query: match, select, cursor: options } }, res, next) => {
    try {
      delete options.sort
      await model.populate({
        path: 'versions.vehicles',
        match,
        select,
        options
      }).execPopulate()
      await http.ok(res, {
        vehicles: version.vehicles,
        count: version.vehicles.length
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
  async ({ params: { id }, querymen: { select } }, res, next) => {
    try {
      const vehicle = await Vehicle.findById(id).select(select)
      if (!vehicle) {
        return http.notFound(res, {
          error: true,
          msg: 'vehicle not found',
          code: 404
        })
      }
      http.ok(res, vehicle)
    } catch (error) {
      http.internalError(res, error)
    }
  }
]
exports.create = [
  async (req, res, next) => {
    upload.array('images')(req, res, async (error) => {
      const { version, model, body: { color, options: newOptions } } = req
      if (verifyOptionColors(res, color || undefined, version.colors, newOptions, version.options)) {
        return
      }
      const { files, body } = req
      if (error) return http.badRequest(res, error)
      body.images = files.map(
        image => `/public/images/${image.filename}`
      )
      try {
        const vehicle = await new Vehicle(body).save()
        version.vehicles.push(vehicle.id)
        await model.save()
        await http.ok(res, vehicle)
        next()
      } catch (error) {
        http.badRequest(res, error)
        next(error)
      }
    })
  }
]
exports.update = [
  checkVehicle,
  (req, res, next) => {
    upload.array('newImages')(req, res, async error => {
      const { version, body: { color, options: newOptions } } = req
      if (verifyOptionColors(res, color || undefined, version.colors, newOptions, version.options)) {
        return
      }
      if (error) return http.internalError(res, error)
      const { files, body } = req
      const vehicle = await Vehicle.findById(req.params.id)
      if (files.length) {
        body.images = JSON.parse(body.images)
        body.images = [
          ...(body.images ? body.images : vehicle.images),
          ...files.map(
            file => `/public/images/${file.filename}`
          )
        ]
        for (let i = 0; i < vehicle.images.length; i++) {
          let image = vehicle.images[i]
          image = image.split('/').pop()
          console.log({ image })
          fs.unlink(`./public/images/${image}`, async error => {
            if (error) return false
          })
        }
        try {
          vehicle.set(body)
          await vehicle.save()
          await http.ok(res, {
            nModified: 1,
            ok: 1,
            n: 1,
            images: body.images
          })
        } catch (error) {
          http.badRequest(res, error)
        }
      } else next()
    })
  },
  crud.findAndUpdate
]
exports.deleteOne = [
  checkVehicle,
  crud.deleteOne,
  async ({ version, params: { id } }, res, next) => {
    try {
      version.vehicles.remove(id)
      await version.save()
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
    msg: 'vehicle not foundf'
  })
}

function verify (array1, array2) {
  console.log({ array1, array2 })
  for (let item1 of array1) {
    if (array2.find(
      i => i == item1
    )
    ) continue
    else return item1
  }
}

function verifyOptionColors (res, color, colors, newOptions, options) {
  console.log({ arguments })
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
