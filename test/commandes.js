
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
            console.log({ res })
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { commands, count } = json
            expect(commands).to.be.array()
            expect(commands).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.be.gte(commands.length)
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
            let { manufacturer: { admins }, count } = json
            expect(admins).to.be.array()
            expect(admins).to.be.ofSize(0)
            expect(admins).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.eq(0)
          })
      }
    )
    // it('should create a manufacturer admin',
    //   () => {
    //     return fetch('manufacturers/Toyota/admins', {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         email: uuid.v4() + '@admin.dz',
    //         password: ''
    //       }),
    //       headers: {
    //         'Content-Type': 'Application/json'
    //       }
    //     })
    //       .then(res => res.json())
    //       .then(json => {
    //         const { error, id, msg } = json
    //         expect(error).to.be.undefined
    //         expect(msg).to.be.undefined
    //         console.log({ json })
    //         ids.push(id)
    //       })
    //   }
    // )
  })
}
