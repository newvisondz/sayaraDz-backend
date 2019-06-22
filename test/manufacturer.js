const axios = require('axios')
const FormData = require('form-data')
const fetch = require('./fetch')
const { expect } = require('chai')
const uuid = require('uuid')

const ids = []
module.exports = (token) => {
  describe('Manufacturer api', _ => {
    // const fetch = axios.create({
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'Authorization': token
    //   }
    // })
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
            console.log({ json })
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
        fetch('manufacturers/Toyota', {
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
        const body = JSON.stringify(
          {
            brand: uuid.v4()
          }
        )
        fetch('manufacturers/' + uuid.v4(), {
          method: 'PUT',
          body,
          headers: {
            'Content-Type': 'Application/json'
          }
        })
          .then(res => {
            // expect(res.ok).to.be.false
            expect(res.status).to.eq(404)
            return res.json()
          })
      }
    )
  })
}
