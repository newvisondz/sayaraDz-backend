const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const utils = require('../utils')

const providers = ['google', 'facebook']

const AutoMobilisteSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    validate: validator.isEmail,
    trim: true
  },
  password: {
    type: String,
    minlength: 4
  },
  providers: [{
    name: {
      type: String,
      enum: providers
    },
    id: {
      type: String,
      validate: () => {}
    }
  }],
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    validate: validator.isMobilePhone
  }
}, {
  timestamps: true
})

AutoMobilisteSchema.pre('save', utils.preSaveUser)

AutoMobilisteSchema.methods.isValidPasswd = utils.isValidPasswd

AutoMobilisteSchema.methods.sign = utils.sign

AutoMobilisteSchema.virtual('type').get(() => utils.USER_TYPE.AUTOMOBILISTE)

AutoMobilisteSchema.methods.toJSON = function () {
  const { email, id, token, providers, firstName, lastName } = this
  let prs = []
  for (let p of providers) {
    prs.push({ id: p.id, name: p.name })
  }
  return { email, id, token, firstName, lastName, providers: prs }
}

AutoMobilisteSchema.statics.type = () => utils.USER_TYPE.AUTOMOBILISTE

const Automobiliste = mongoose.model('Automobiliste', AutoMobilisteSchema)

module.exports = Automobiliste
