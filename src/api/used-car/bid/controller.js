const { ok, badRequest, internalError, created, notFound } = require('../../../services/http')
const Model = require('./model')
const query = require('querymen').middleware
const { createNotFoundError } = require('../../utils')
const { PENDING, INITIAL } = require('../states')

exports.create = [
  async ({ usedCar, body, user }, res) => {
    try {
      let newCar = await new Model({
        price: body.price,
        creator: user.id,
        usedCar: usedCar
      }).save()
      created(res, newCar)
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
]

exports.accept = [
  async ({ car, usedCar, params: { id }, user }, res) => {
    try {
      if ((car.owner != user.id) || car.sold || (car.state !== INITIAL)) {
        return notFound(res, createNotFoundError('Bidd ', id))
      }
      const result = await Model.update({ usedCar, _id: id }, {
        state: PENDING
      })
      if (result.ok && result.n) {
        car.state = PENDING
        await car.save()
        ok(res, result)
      } else {
        notFound(res, createNotFoundError('Bid ', id))
      }
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.reject = [
  async ({ car, usedCar, params: { id }, user }, res) => {
    try {
      if ((car.owner != user.id) || car.sold || (car.state !== PENDING)) {
        return notFound(res, createNotFoundError('Bidd ', id))
      }
      const result = await Model.updateOne({ usedCar, _id: id, state: PENDING }, {
        state: INITIAL
      })
      if (result.ok && result.n) {
        car.state = INITIAL
        await car.save()
        ok(res, result)
      } else {
        notFound(res, createNotFoundError('Bid ', id))
      }
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.list = [
  query(),
  async ({ usedCar, querymen: { cursor, select } }, res) => {
    try {
      const bids = !select.creator
        ? await Model.find({ usedCar }, select, cursor)
        : await Model.find({ usedCar }, select, cursor)
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
