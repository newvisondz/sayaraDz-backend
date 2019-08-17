const { ok, badRequest, internalError, created } = require('../../../services/http')
const Model = require('./model')

exports.create = [
  async ({ usedCar, body, user: { id: owner } }, res) => {
    try {
      const newCar = await new Model({
        price: this.price,
        owner,
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
  async ({ usedCar, user }, res) => {
    try {
      const bids = await Model.find({ usedCar })
      ok(res, bids)
    } catch (error) {
      internalError(res, error)
    }
  }
]
