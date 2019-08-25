const { isAdmin, authenticated } = require('../../services/acl')
const { validateAccount, validateExternalAccount } = require('../payment/middlewares')
const { internalError, ok, badRequest } = require('../../services/http')
const { createAccount, deleteExternalAccount, createExternalAccount } = require('../payment/stripe')

exports.updatePaymentAccount = [
  isAdmin,
  authenticated,
  validateAccount,
  async ({ manufacturer, body, user, paymentAccount }, res) => {
    try {
      const account = await createAccount(paymentAccount)
      const { id: stripeAccountId } = account
      body['external_account'].id = account['external_accounts'].data[0].id
      manufacturer.paymentAccount = body
      manufacturer.stripeAccountIds.push(stripeAccountId)
      manufacturer.validStripeAccountId = stripeAccountId
      await manufacturer.save()

      ok(res, {
        success: 'ok'
      })
    } catch (error) {
      console.error(error)
      internalError(res, error)
    }
  }
]

exports.updatePaymentExternalAccount = [
  isAdmin,
  authenticated,
  validateExternalAccount,
  async ({ manufacturer, body, user, paymentAccount }, res) => {
    try {
      const { validStripeAccountId } = manufacturer
      if (!validStripeAccountId) {
        return badRequest(res)
      }
      body.object = 'bank_account'
      const externalAccount = await createExternalAccount(
        manufacturer.validStripeAccountId,
        {
          external_account: body,
          default_for_currency: true
        }
      )
      deleteExternalAccount(
        manufacturer.validStripeAccountId,
        manufacturer.paymentAccount['external_account'].id
      )
      body.id = externalAccount.id
      manufacturer.paymentAccount.external_account = body
      manufacturer.markModified('paymentAccount')
      await manufacturer.save()
      ok(res, {
        success: 'ok'
      })
    } catch (error) {
      console.error(error)
      internalError(res, error)
    }
  }
]
