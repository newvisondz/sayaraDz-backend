const querymen = require('querymen')
const { ok, notFound, badRequest, internalError } = require('../../services/http')
const { verifyResult, createNotFoundError } = require('../utils')
const Model = require('./model')
const { getTotalPrice } = require('./resolvers')
const { validateCreateBody, validateUpdateBody } = require('./validation')

exports.total = async ({ query: { options = [] } }, res) => {
  const total = await getTotalPrice(...options)
  res.json({
    total
  })
}

exports.list = [
  querymen.middleware({
    start: {
      type: Date,
      paths: ['start'],
      operator: '$gte'
    },
    end: {
      type: Date,
      paths: ['end'],
      operator: '$lte'
    }
  }),
  async ({ params: { id: document }, querymen: { query, select, cursor }, querymen }, res) => {
    try {
      const tarifs = await Model.find({ ...query, document }, select, cursor)
      ok(res, tarifs)
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.create = [
  validateCreateBody,
  async ({ body, body: { code, document }, model }, res) => {
    try {
      if (!verify(code, document, model)) {
        return notFound(
          res,
          createNotFoundError(
            ['version', 'option', 'color'][code], document
          )
        )
      }
      const tarif = await new Model(body).save()
      ok(res, tarif)
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
]

exports.update = [
  validateUpdateBody,
  async ({ params: { id: _id }, body }, res) => {
    try {
      const result = await Model.updateOne({ _id }, body)
      if (!verifyResult(result)) {
        return notFound(res, createNotFoundError('tarif', _id))
      }
      ok(res, result)
    } catch (error) {
      console.error(error)
      res.status(500).json({
        error: true
      })
    }
  }
]

exports.destroy = async ({ params: { id: _id } }, res) => {
  try {
    const result = await Model.deleteOne({ _id })
    if (!verifyResult(result)) {
      return notFound(res, createNotFoundError('tarif', _id))
    }
    ok(res, result)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: true
    })
  }
}

const verify = (code, id, model) => {
  switch (code) {
    case '0': return model.versions.id(id)
    case '1': return model.options.id(id)
    case '2': return model.colors.id(id)
    default: return false
  }
}
