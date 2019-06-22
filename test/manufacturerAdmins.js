
const fetch = require('./fetch')
const { expect } = require('chai')
const chai = require('chai')
const chaiArrays = require('chai-arrays')
const uuid = require('uuid')
chai.use(chaiArrays)
const ids = []
module.exports = _ => {
  describe('Manufacturer Admins api', _ => {
    it('should get a list of admins',
      () => {
        return fetch('manufacturers/Toyota/admins?limit=1&page=1&sort=email', {
          method: 'GET'
        })
          .then(res => {
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { manufacturer: { admins }, count } = json
            expect(admins).to.be.array()
            expect(admins).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.be.gte(admins.length)
          })
      }
    )
    it('should get an empty list of admins',
      () => {
        return fetch('manufacturers/Toyota/admins?limit=1&page=1&sort=createdAt&&q=' + uuid.v4(), {
          method: 'GET'
        })
          .then(res => {
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { manufacturer: { admins }, count } = json
            expect(admins).to.be.array()
            expect(admins).to.be.ofSize(0)
            expect(admins).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.eq(0)
          })
      }
    )
    it('should create a manufacturer admin',
      () => {
        return fetch('manufacturers/Toyota/admins', {
          method: 'POST',
          body: JSON.stringify({
            email: uuid.v4() + '@admin.dz',
            password: ''
          }),
          headers: {
            'Content-Type': 'Application/json'
          }
        })
          .then(res => res.json())
          .then(json => {
            const { error, id, msg } = json
            expect(error).to.be.undefined
            expect(msg).to.be.undefined
            console.log({ json })
            ids.push(id)
          })
      }
    )
  })
}
