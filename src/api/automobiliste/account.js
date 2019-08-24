const { isAutomobiliste, authenticated } = require('../../services/acl')
const { validateAccount } = require('../payment/middlewares')
const { internalError, ok } = require('../../services/http')
const { createAccount, deleteAccount } = require('../payment/stripe')

exports.updatePaymentAccount = [
  isAutomobiliste,
  authenticated,
  validateAccount,
  async ({ body, user, paymentAccount }, res) => {
    try {
      if (user.stripeAccountId) {
        deleteAccount(user.stripeAccountId).catch(console.log)
      }
      const account = await createAccount(paymentAccount)
      const { id: stripeAccountId } = account
      console.log({ account })
      user.paymentAccount = body
      user.stripeAccountId = stripeAccountId
      await user.save()
      ok(res, user)
    } catch (error) {
      internalError(res, error)
    }
  }
]
