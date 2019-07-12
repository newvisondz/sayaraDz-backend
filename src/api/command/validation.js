const joi = require('@hapi/joi')
const { validate } = require('../utils/validation')
const createBodySchema = joi.object().keys({
  vehicle: joi.string().required()
})

const updateBodySchema = joi.object().keys({
  canceled: joi.boolean().required()
})

exports.validateCreateBody = validate(createBodySchema)
exports.validateUpdateBody = validate(updateBodySchema)
