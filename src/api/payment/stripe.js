const { validateAccount } = require('./validation')

const customAccount = {
  country: 'US',
  email: 'akrdsaa@manufacturer.dz',
  individual: {
    first_name: 'akrambenrandja',
    last_name: 'benrandja akram',
    ssn_last_4: '8888'
  },
  business_profile: {
    url: 'https://esi.dz'
  },
  external_account: {
    country: 'US',
    currency: 'USD',
    account_number: '000123456789',
    routing_number: '110000000'
  }

}

validateAccount(customAccount).then(console.log)// .catch(console.error)
