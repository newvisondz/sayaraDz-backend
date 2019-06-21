const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const USER_TYPE = {
  ADMIN: 'ADMIN',
  AUTOMOBILISTE: 'AUTOMOBILISTE',
  FABRICANT: 'FABRICANT'
}

function sign () {
  return 'bearer ' + jsonwebtoken.sign({
    id: this.id,
    type: this.type
  }, process.env.jwt_key, {
    expiresIn: '99d'
  })
}

function isValidPasswd (password, cb) {
  bcrypt.compare(password, this.password)
    .then(isValid => {
      cb(null, isValid)
    })
    .catch(err => cb(err))
}

function preSaveUser (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.hash(this.password, 12)
    .then(hash => {
      this.password = hash
      next()
    })
    .catch(next)
}
const storedOptions = (options) => {
  const newOptions = []
  if (options) {
    for (const option of options) {
      for (const value of option.values) {
        newOptions.push({
          name: option.name,
          value
        })
      }
    }
  }
  return options ? newOptions : options
}
const retrievedOptions = (options = []) => {
  let newOptions = []
  for (let option of options) {
    let element = newOptions.find(
      e => e.name == option.name
    )
    if (element) {
      element.values.push({
        value: option.value,
        id: option.id
      })
    } else {
      element = {
        name: option.name,
        values: [{
          value: option.value,
          id: option.id
        }]
      }
      newOptions.push(element)
    }
  }
  return newOptions
}
const verifyIds = (ids, array) => {
  for (let id of ids) {
    if (array.find(
      e => e.id == id
    )) continue
    else return id
  }
}

const findById = (id, array) => array.find(
  e => e.id == id
)
const filterById = (ids, array) => {
  return array.filter(
    e => ids.find(
      id => e.id == id
    )
  )
}
const without = (array1, array2) => array1.filter(
  img => !array2.find(
    bodyImage => bodyImage == img
  )
)

const verifyResult = (result) => {
  if (result.ok && result.n) {
    return true
  } else return false
}

const createNotFoundError = (model, id) => ({
  error: true,
  msg: `${model}<${id}> not found`
})
module.exports = {
  USER_TYPE,
  sign,
  isValidPasswd,
  preSaveUser,
  storedOptions,
  retrievedOptions,
  verifyIds,
  findById,
  filterById,
  without,
  verifyResult,
  createNotFoundError
}
