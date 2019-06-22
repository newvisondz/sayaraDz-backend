const axios = require('axios')
const testAdmin = require('./admin.test')
const manufacturer = require('./manufacturer')
const manufacturerAdmins = require('./manufacturerAdmins')
const commandes = require('./commandes')

describe('SayaraDZ', () => {
  before((done) => {
    axios
      .post('http://localhost:3000/login', {
        email: 'sayara@esi.dz',
        password: 'root'
      })
      .then(
        response => {
          // token = response.data.token
          console.log({ token: exports.token })
          done()
        })
      .catch(console.error)
  })

  describe('Admin', () => {
    testAdmin.authenticate()
  })
  describe('Manufacturers', () => {
    manufacturer()
  })
  describe('Manufacturers Admins', () => {
    manufacturerAdmins()
  })
  describe('Commandes', () => {
    commandes()
  })
  after(() => {
  })
})
