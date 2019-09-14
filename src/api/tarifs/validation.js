const joi = require('@hapi/joi')
const moment = require('moment')
const { validate } = require('../utils/validation')

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
exports.createBodySchema = createBodySchema
exports.validateCreateBody = validate(createBodySchema)
exports.validateUpdateBody = validate(updateBodySchema)
