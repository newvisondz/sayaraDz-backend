const http = require('../../services/http')
const Vehicle = require('./model')
const crud = require('../../services/crud')(Vehicle)
const query = require('querymen').middleware

exports.read = [
  query(Vehicle.querySchema()),
  async ({ model, version, querymen: { query: match, select, cursor: options } }, res, next) => {
    try {
      console.log({ match, options })
      delete options.sort
      await model.populate({
        path: 'versions.vehicles',
        match,
        select,
        options
      }).execPopulate()
      await http.ok(res, version.vehicles)
      next()
    } catch (error) {
      await http.internalError(res)
      next(error)
    }
  }
]
exports.create = [
  async ({ version, model, body }, res, next) => {
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
  }
]
exports.update = [
  checkVehicle,
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
  const includes = version.vehicles.includes(id)
  if (includes) return next()
  http.notFound(res, {
    error: true,
    msg: 'vehicle not found'
  })
}
