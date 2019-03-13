const { isAutomobiliste, authenticated } = require('../../services/acl')
const Automobiliste = require('./model')
const crud = require('../../services/crud')(Automobiliste, 'automobiliste')

exports.readMe = [
  isAutomobiliste,
  authenticated,
  (req, res) => {
    res.json(req.user)
  }
]

exports.update = [
  isAutomobiliste,
  authenticated,
  (req, res, next) => {
    delete req.body.email
    delete req.body.providers
    req.params.id = req.user.id
    next()
  },
  crud.update
]
// generate automobiliste token
// Automobiliste.findById('5c7184d3f99c9f6b358482a2')
//   .then(user => console.log(user.sign()))
