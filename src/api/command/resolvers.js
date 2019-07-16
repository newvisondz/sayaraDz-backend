const Manufacturer = require('../manufacturer/model')
const Model = require('./model')
const _ = require('underscore')

exports.listManufacturerCommands = async (id) => {
  try {
    let vehicles = []
    const { models } = await Manufacturer.findById(id).populate('models').select('models')
    for (let m of models) {
      for (let v of m.versions) {
        vehicles.push(v.vehicles)
      }
    }
    vehicles = _.flatten(vehicles)
    const commands = await Model.find({
      vehicle: vehicles
    })
    return commands
  } catch (error) {
    throw error
  }
}
