const joi = require('@hapi/joi')

const customAccount = {
  type: 'custom',
  requested_capabilities: ['transfers'],
  business_type: 'individual',
  tos_acceptance: {
    date: new Date(),
    ip: '192.168.1.1'
  }
}

const schema = joi.object().keys({
  country: joi.string().min(2).max(2).required(),
  email: joi.string().email().required(),
  individual: joi.object().keys({
    first_name: joi.string().min(1).required(),
    last_name: joi.string().min(1).required(),
    ssn_last_4: joi.string().min(4).max(4).required()
  }).required(),
  business_profile: {
    url: joi.string().uri().required()
  },
  external_account: joi.object().keys({
    country: joi.string().min(2).max(2).required(),
    currency: joi.string().min(2).max(3).required(),
    account_number: joi.string().min(8).required(),
    routing_number: joi.string().min(9).max(9).required()
  }).required()
})

exports.validateAccount = (account) => joi
  .validate(account, schema)
  .then(
    value => Object.assign(value, customAccount)
  )

// stripe.accounts.create({
//   type: 'custom',
//   country: 'US',
//   requested_capabilities: ['transfers'],
//   business_type: 'individual',
//   email: 'akrdsaa@manufacturer.dz',
//   individual: {
//     first_name: 'akrambenrandja',
//     last_name: 'benrandja akram',
//     ssn_last_4: '8888'
//   },
//   business_profile: {
//     url: 'https://esi.dz'
//   },
//   tos_acceptance: {
//     date: new Date(),
//     ip: '192.168.1.1'
//   },
//   external_account: {
//     country: 'US',
//     object: 'bank_account',
//     currency: 'USD',
//     account_number: '000123456789',
//     routing_number: '110000000'
//   }

// }, function (err, account) {
//   console.log({ account })
//   console.error(err)
// })
