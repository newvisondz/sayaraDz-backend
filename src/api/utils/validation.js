const joi = require('@hapi/joi')
const { badRequest } = require('../../services/http')

exports.validate = (schema) => async ({ body }, res, next) => {
  try {
    await joi.validate(body, schema)
    next()
  } catch (error) {
    console.error(error)
    badRequest(res, error)
  }
}
