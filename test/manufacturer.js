const FormData = require('form-data')
const fetch = require('./fetch')
const { expect } = require('chai')
const chai = require('chai')
const chaiArrays = require('chai-arrays')
const uuid = require('uuid')

chai.use(chaiArrays)
const ids = []

module.exports = (token) => {
  describe('Manufacturer api', _ => {
    it('should get a list of manufacturers',
      () => {
        return fetch('manufacturers?limit=1&page=1&sort=createdAt', {
          method: 'GET'
        })
          .then(res => {
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { manufacturers, count } = json
            expect(manufacturers).to.be.array()
            expect(manufacturers).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.be.gte(manufacturers.length)
          })
      }
    )
    it('should get an empty list of manufacturers',
      () => {
        return fetch('manufacturers?limit=1&page=1&sort=createdAt&&q=' + uuid.v4(), {
          method: 'GET'
        })
          .then(res => {
            expect(res.ok).to.be.true
            expect(res.status).to.eq(200)
            return res.json()
          })
          .then(json => {
            let { manufacturers, count } = json
            expect(manufacturers).to.be.array()
            expect(manufacturers).to.be.ofSize(0)
            expect(manufacturers).to.be.sorted((prev, next) => prev.createdAt < next.createdAt)
            expect(count).to.exist
            expect(count).to.eq(0)
          })
      }
    )

    it('should create a manufacturer',
      () => {
        const body = new FormData()
        body.append('brand', uuid.v4())
        return fetch('manufacturers', {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(res => res.json())
          .then(json => {
            const { error, id, msg } = json
            expect(error).to.be.undefined
            expect(msg).to.be.undefined
            ids.push(id)
          })
      }
    )

    it('should not create a manufacturer and return badrequest',
      () => {
        return fetch('manufacturers', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(res => {
            expect(res.ok).to.be.false
            expect(res.status).to.eq(400)
            return res.json()
          })
          .then(json => {
            const { error, id, msg } = json
            expect(error).to.be.undefined
            expect(msg).to.be.undefined
            ids.push(id)
          })
      }
    )
    it('should update a manufacturer',
      () => {
        const body = JSON.stringify(
          {
            brand: uuid.v4()
          }
        )
        return fetch('manufacturers/Toyota', {
          method: 'PUT',
          body,
          headers: {
            'Content-Type': 'Application/json'
          }
        })
          .then(res => {
            expect(res.ok).to.be.true
            return res.json()
          })
          .then(json => {
            let { error, ok, n } = json
            ok = !!ok
            expect(error).to.be.undefined
            expect(ok).to.be.true
            expect(n).to.be.greaterThan(0)
          })
      }
    )
    it('should generate not found',
      () => {
        fetch('manufacturers/' + uuid.v4(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'Application/json'
          }
        })
          .then(async res => {
            expect(res.ok).to.be.false
            expect(res.status).to.eq(404)
            const { error } = await res.json()
            expect(error).to.eq('true')
          })
      }
    )
  })
}
