const { ok, notFound, badRequest } = require('../../services/http')
const { verifyResult, createNotFoundError } = require('../utils')
const Model = require('./model')

exports.create =
  async ({ body, body: { code, document }, version, model }, res) => {
    try {
      if (!version && !verify(code, document, model)) {
        return notFound(
          res,
          createNotFoundError(
            ['option', 'color'][code - 1], document
          )
        )
      }
      const tarif = new Model({
        ...body,
        document: version || document
      })
      const savedTarif = await tarif.save()
      ok(res, savedTarif)
    } catch (error) {
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
    case 1: return !!model.options.id(id)
    case 2: return !!model.colors.id(id)
    default: return false
  }
}
