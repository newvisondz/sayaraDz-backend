const { badRequest } = require('../../services/http')
const { validateAccount: validateAccountBody, validateExternalAccountBody } = require('./validation')

exports.validateAccount = async (req, res, next) => {
  try {
    req.paymentAccount = await validateAccountBody(req.body)
    next()
  } catch (error) {
    badRequest(res, error)
  }
}

exports.validateExternalAccount = async (req, res, next) => {
  try {
    req.paymentAccount = await validateExternalAccountBody(req.body)
    next()
  } catch (error) {
    badRequest(res, error)
  }
}
