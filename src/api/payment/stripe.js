const stripe = require('stripe')(process.env.stripe || 'sk_test_EQNLM3JGIF2seT3QlNjwCIEP00DX0gMD6Q')

exports.createAccount = (account) => stripe.accounts.create(account)

exports.deleteAccount = (account) => stripe.accounts.del(account)

exports.deleteExternalAccount = (account, external) => stripe.accounts.deleteExternalAccount(account, external)

exports.createExternalAccount = (account, external) => stripe.accounts.createExternalAccount(account, external)

exports.charge = (source, amount, destination) => stripe.charges.create({
  amount,
  source,
  application_fee_amount: Math.trunc(amount * 5 / 100),
  currency: 'dzd',
  transfer_data: {
    destination
  }
})

// stripe.charges.create({
//   amount: 100000,
//   currency: 'dzd',
//   source: 'tok_visa',
//   transfer_data: {
//     destination: 'acct_1FB3k9EZ5SYlS2Mo'
//   }
// }).then(function (charge) {
//   console.log({ charge })
// }).catch(err => { throw err })
