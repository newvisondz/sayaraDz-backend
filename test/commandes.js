
const fetch = require('./fetch')
const { expect } = require('chai')
const chai = require('chai')
const chaiArrays = require('chai-arrays')
const uuid = require('uuid')
chai.use(chaiArrays)
const ids = []
const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMGRmZTZiZDMxMmM4NjVhNGM0MTgzNSIsInR5cGUiOiJBVVRPTU9CSUxJU1RFIiwiaWF0IjoxNTYxMTk4MTg4LCJleHAiOjE1Njk3NTE3ODh9.C96M0VS7g-XqIuRJysPacS7k3Tt8D3Z2n482Vv-2BX4'
module.exports = _ => {
  describe('Commandes api', _ => {
    it('should get a list of commands',
      () => {
        return fetch('commande?limit=2&page=1&sort=createdAt', {
          method: 'GET'
        }, token)
          .then(res => {
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { commandes, count } = json
            expect(commandes).to.be.array()
            expect(commandes).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.be.gte(commandes.length)
          })
      }
    )
    it('should get unauthorized access',
      () => {
        return fetch('commande?limit=2&page=1&sort=createdAt', {
          method: 'GET'
        })
          .then(res => {
            expect(res.ok).to.be.false
            expect(res.status).to.eq(401)
          })
      }
    )
    it('should get an empty list of commandes',
      () => {
        return fetch('commande?limit=1&page=1&sort=createdAt&&q=' + uuid.v4(), {
          method: 'GET'
        }, token)
          .then(res => {
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { commandes, count } = json
            expect(commandes).to.be.array()
            expect(commandes).to.be.ofSize(0)
            expect(commandes).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.eq(0)
          })
      }
    )

    it('should get bad request vehicule field undefined',
      () => {
        return fetch('commande', {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json'
          }
        }, token)
          .then(res => {
            console.log(res)
            expect(res.ok).to.be.false
            expect(res.status).to.eq(400)
            return res.json()
          })
      }
    )
  })
}
