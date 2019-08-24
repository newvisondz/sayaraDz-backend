const { badRequest } = require('../../services/http')
const { validateAccount } = require('./validation')

exports.validateAccount = async ({ body }, res, next) => {
  try {
    await validateAccount(body)
    next()
  } catch (error) {
    badRequest(res, error)
  }
}
