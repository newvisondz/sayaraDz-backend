const { isAdmin, authenticated } = require('../../services/acl')
const { validateAccount } = require('../payment/middlewares')
const { internalError, ok } = require('../../services/http')
const { createAccount, deleteAccount } = require('../payment/stripe')

exports.updatePaymentAccount = [
  isAdmin,
  authenticated,
  validateAccount,
  async ({ manufacturer, body, user, paymentAccount }, res) => {
    try {
      const account = await createAccount(paymentAccount)
      const oldStripeAccountId = manufacturer.stripeAccountId
      const { id: stripeAccountId } = account
      manufacturer.paymentAccount = body
      manufacturer.stripeAccountId = stripeAccountId
      await manufacturer.save()
      if (manufacturer.stripeAccountId) {
        deleteAccount(oldStripeAccountId).catch(console.log)
      }
      ok(res, {
        success: 'ok'
      })
    } catch (error) {
      internalError(res, error)
    }
  }
]
