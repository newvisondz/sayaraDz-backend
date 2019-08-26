const { isAutomobiliste, authenticated } = require('../../services/acl')
const { validateAccount, validateExternalAccount } = require('../payment/middlewares')
const { internalError, ok, badRequest } = require('../../services/http')
const { createAccount, deleteExternalAccount, createExternalAccount } = require('../payment/stripe')

exports.updatePaymentAccount = [
  isAutomobiliste,
  authenticated,
  validateAccount,
  async ({ body, user, paymentAccount }, res) => {
    try {
      const account = await createAccount(paymentAccount)
      const { id: stripeAccountId } = account
      body['external_account'].id = account['external_accounts'].data[0].id
      user.paymentAccount = body
      user.stripeAccountIds.push(stripeAccountId)
      user.validStripeAccountId = stripeAccountId
      await user.save()

      ok(res, {
        success: 'ok'
      })
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
]

exports.updatePaymentExternalAccount = [
  isAutomobiliste,
  authenticated,
  validateExternalAccount,
  async ({ body, user, paymentAccount }, res) => {
    try {
      const { validStripeAccountId } = user
      if (!validStripeAccountId) {
        return badRequest(res)
      }
      body.object = 'bank_account'
      const externalAccount = await createExternalAccount(
        user.validStripeAccountId,
        {
          external_account: body,
          default_for_currency: true
        }
      )
      // deleteExternalAccount(
      //   user.validStripeAccountId,
      //   user.paymentAccount['external_account'].id
      // )
      body.id = externalAccount.id
      user.paymentAccount.external_account = body
      user.markModified('paymentAccount')
      await user.save()
      ok(res, {
        success: 'ok'
      })
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
]
