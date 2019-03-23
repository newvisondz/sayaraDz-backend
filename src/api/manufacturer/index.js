const express = require('express')
const router = express.Router()
const { read, create, deleteOne, update, createWithLogo } = require('./controller')
const admin = require('./admin')
const user = require('./user')
const Manufacturer = require('./model')
const http = require('../../services/http')
const { login, logout } = require('../../services/auth')
const model = require('../model')

async function findManufacturer (req, res, next) {
  const { manufacturer: id } = req.params
  const manufacturer = await Manufacturer.findById(id)
  req.manufacturer = manufacturer
  if (manufacturer)next()
  else {
    http.notFound(res, {
      error: true,
      msg: 'manufacturer not found'
    })
  }
}

router.use(['/:manufacturer/*'], findManufacturer)
router.use('/:manufacturer/admins', admin)
router.use('/:manufacturer/users', user)
router.use('/:manufacturer/models', model)

router.post('/login', login('local-manufacturer'))
router.delete('/logout', logout)

router.get('/', read)
router.post('/', create)
router.post('/withlogo', createWithLogo)
router.put('/:id', update)
router.delete('/:id', deleteOne)

module.exports = router
