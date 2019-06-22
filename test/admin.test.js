const {
  expect
} = require('chai')
const axios = require('axios')
// automobilisteToken =
let token
module.exports = {
  authenticate: () => describe('Authentication', () => {
    before((done) => {
      axios
        .post('http://localhost:3000/login', {
          email: 'sayara@esi.dz',
          password: 'root'
        })
        .then(
          response => {
            token = response.data.token
            console.log(token)
            done()
          })
        .catch(console.error)
    })

    it('should return a token', (done) => {
      axios
        .post('http://localhost:3000/login', {
          email: 'sayara@esi.dz',
          password: 'root'
        })
        .then(response => {
          const {
            error,
            token
          } = response.data
          expect(error).to.be.undefined
          expect(token).be.exist
          done()
        })
        .catch((err, response) => {
          done(err)
        })
    })
    it('should return error with invalid credentials', (done) => {
      axios
        .post('http://localhost:3000/login', {
          email: 'gmial',
          password: 'root'
        })
        .then(_ => {
          done(new Error('should not login'))
        })
        .catch(_ => done())
    })
    it('should logout', (done) => {
      axios
        .delete('http://localhost:3000/logout', {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          const logout = response.data.logout
          expect(logout).to.be.true
          done()
        })
        .catch(err => done(err))
    })
  })
}
