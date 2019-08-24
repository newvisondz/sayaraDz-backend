const { isAutomobiliste, authenticated } = require('../../services/acl')
const { validateAccount } = require('../payment/middlewares')
const { internalError, ok } = require('../../services/http')

exports.updatePaymentAccount = [
  isAutomobiliste,
  authenticated,
  validateAccount,
  async ({ body, user }, res) => {
    try {
      user.paymentAccount = body
      await user.save()
      ok(res, user)
    } catch (error) {
      internalError(res, error)
    }
  }
]
