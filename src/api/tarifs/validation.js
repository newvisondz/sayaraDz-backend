const joi = require('@hapi/joi')
const moment = require('moment')
const { badRequest } = require('../../services/http')

exports.start = date => true

exports.end = date => true

const createBodySchema = joi.object().keys({
  code: joi.number().integer().min(0).max(2).required(),
  document: joi.string().required(),
  amount: joi.number().positive().required(),
  start: joi.date().required(),
  end: joi.date().min(moment().format('MM-DD-YYYY')).required()
})

const updateBodySchema = joi.object().keys({
  amount: joi.number().positive(),
  start: joi.date(),
  end: joi.date().min(moment().format('MM-DD-YYYY'))
})

const validate = (schema) => async ({ body }, res, next) => {
  try {
    await joi.validate(body, schema)
    next()
  } catch (error) {
    console.error(error)
    badRequest(res, error)
  }
}
exports.validateCreateBody = validate(createBodySchema)
exports.validateUpdateBody = validate(updateBodySchema)
