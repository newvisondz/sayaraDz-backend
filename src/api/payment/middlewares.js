const { badRequest } = require('../../services/http')
const { validateAccount } = require('./validation')

exports.validateAccount = async (req, res, next) => {
  try {
    req.paymentAccount = await validateAccount(req.body)
    next()
  } catch (error) {
    badRequest(res, error)
  }
}
