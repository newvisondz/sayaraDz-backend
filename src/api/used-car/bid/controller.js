const { ok, badRequest, internalError, created, notFound } = require('../../../services/http')
const Model = require('./model')
const query = require('querymen').middleware
const { createNotFoundError } = require('../../utils')

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
  query(),
  async ({ usedCar, querymen: { cursor, select } }, res) => {
    try {
      const bids = !select.creator ? await Model.find({ usedCar }, select, cursor) : await Model.find({ usedCar }, select, cursor)
        .populate('creator', 'id firstName lastName phone address')

      ok(res, bids)
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.destroy = [
  async ({ params: { id }, user }, res) => {
    try {
      const result = await Model.deleteOne({ _id: id, creator: user.id })
      console.log({ result, user })
      if (result.ok && result.n) {
        return ok(res, result)
      }
      notFound(res, createNotFoundError('Bid ', id))
    } catch (error) {
      internalError(res, error)
    }
  }
]
