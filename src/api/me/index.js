const express = require('express')
const router = express.Router()
const { isUser, isFabricant, authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('../manufacturer/user/model')
const { ok } = require('../../services/http')
const crud = require('../../services/crud')(ManufacturerUser)

const me = [
  isUser,
  ({ user }, res, next) => {
    ok(res, user)
  }
]

const update = [
  isFabricant,
  isFabricantAdmin,
  authenticated,
  (req, res, next) => {
    req.params.id = req.user.id
    delete req.body.isAdmin
    delete req.body.manufacturer
    next()
  },
  crud.findAndUpdate
]
router.use((req, res, next) => {
  console.log({ user: req.user })
  next()
})
router.get('/', me)
router.put('/', update)

module.exports = router
console.log(this)
