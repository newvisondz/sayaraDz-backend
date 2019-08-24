const { ok, internalError, badRequest, notFound } = require('../../services/http')
const UsedVehicle = require('./model')
const query = require('querymen').middleware
const { upload } = require('../../services/upload')
const { createNotFoundError } = require('../utils')

exports.create = [
  async (req, res, next) => {
    upload.array('images')(req, res, async (error) => {
      if (error) return internalError(res, error)
      const { files, body } = req
      body.images = files && files.map(
        image => '/public/' + image.filename
      )
      try {
        const vehicle = await new UsedVehicle({
          ...body,
          owner: req.user.id
        }).save()
        await ok(res, vehicle)
        next()
      } catch (error) {
        badRequest(res, error)
        next(error)
      }
    })
  }
]

exports.list = [
  query({
    title: String,
    manufacturer: String,
    model: String,
    version: String,
    owner: String,
    color: String,
    minPrice: {
      type: Number,
      paths: ['minPrice'],
      operator: '$gte'
    },
    maxPrice: {
      type: Number,
      paths: ['minPrice'],
      operator: '$lte'
    },
    minCurrentMiles: {
      type: Number,
      paths: ['currentMiles'],
      operator: '$gte'
    },
    maxCurrentMiles: {
      type: Number,
      paths: ['currentMiles'],
      operator: '$lte'
    }
  }),
  async ({ querymen: { query, cursor, select }, user }, res, next) => {
    try {
      const cars = await UsedVehicle.find(query, select, cursor)
      ok(res, cars)
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.destroy = [
  async ({ params: { id }, user }, res, next) => {
    try {
      const result = await UsedVehicle.deleteOne({ _id: id, owner: user.id })
      if (result.ok && result.n) {
        ok(res, result)
      } else notFound(res, createNotFoundError('Used car ', id))
    } catch (error) {
      if (error.name == 'CastError') {
        return notFound(res, createNotFoundError('Used car ', id))
      }
      internalError(res, error)
    }
  }
]
