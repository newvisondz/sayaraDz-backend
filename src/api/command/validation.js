const joi = require('@hapi/joi')
const { validate } = require('../utils/validation')

const createBodySchema = joi.object().keys({
  vehicle: joi.string().required()
})

const updateBodySchema = joi.object().keys({
  canceled: joi.boolean().required()
})

const paymentBodySchema = joi.object().keys({
  token: joi.string().min(1).required()
})

exports.validateCreateBody = validate(createBodySchema)
exports.validateUpdateBody = validate(updateBodySchema)
exports.validatePaymentBody = validate(paymentBodySchema)
