const querymen = require('querymen')
const { ok, notFound, badRequest, internalError } = require('../../services/http')
const { verifyResult, createNotFoundError } = require('../utils')
const Model = require('./model')
const { getTotalPrice } = require('./resolvers')

exports.total = async ({ query: { options } }, res) => {
  console.log({ options })
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
      console.log({ tarifs: { querymen } })
      const tarifs = await Model.find({ ...query, document }, select, cursor)
      ok(res, tarifs)
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.create = async ({ body, body: { code, document }, model }, res) => {
  try {
    // return res.json(model.options.id(document))
    if (code == undefined || (code > 3 || code < 0)) return badRequest(res)

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

exports.update = async ({ params: { id: _id }, body }, res) => {
  try {
    const { amount, start, end } = body
    const result = await Model.updateOne({ _id }, {
      amount, start, end
    })
    if (verifyResult(result)) {
      return notFound(res, createNotFoundError('tarif', _id))
    }
    ok(res, result)
  } catch (error) {

  }
}

exports.destroy = async ({ params: { id: _id } }, res) => {
  try {
    const result = await Model.deleteOne({ _id })
    if (verifyResult(result)) {
      return notFound(res, createNotFoundError('tarif', _id))
    }
    ok(res, result)
  } catch (error) {

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
