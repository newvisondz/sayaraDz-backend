const { ok, badRequest, internalError, created } = require('../../../services/http')
const Model = require('./model')
const query = require('querymen').middleware

exports.create = [
  async ({ usedCar, body, user: { id: creator } }, res) => {
    try {
      const newCar = await new Model({
        price: this.price,
        creator,
        usedCar: usedCar
      }).save()
      created(res, newCar)
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
]

exports.list = [
  async ({ usedCar }, res) => {
    try {
      const bids = await Model.find({ usedCar })
        .populate('creator', 'id firstName lastName phone address')

      ok(res, bids)
    } catch (error) {
      internalError(res, error)
    }
  }
]
