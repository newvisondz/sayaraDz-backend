const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const utils = require('../../utils')

const schema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    validate: validator.isEmail,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  isAdmin: Boolean,
  active: Boolean,
  manufacturer: {
    type: String,
    ref: 'Fabricant',
    required: true
  }
}, {
  timestamps: true
})

schema.pre('save', utils.preSaveUser)

schema.methods.isValidPasswd = utils.isValidPasswd

schema.methods.sign = utils.sign

schema.methods.toJSON = function () {
  return {
    email: this.email,
    id: this.id,
    manufacturer: this.manufacturer,
    firstName: this.firstName,
    lastName: this.lastName,
    isAdmin: this.isAdmin || false,
    token: this.token,
    type: this.type,
    address: this.address,
    phone: this.phone
  }
}
schema.virtual('type').get(() => utils.USER_TYPE.FABRICANT)
schema.statics.type = () => utils.USER_TYPE.FABRICANT
schema.plugin(require('mongoose-keywords'), { paths: ['email', 'firstName', 'lastName', 'phone'] })

const ManufacturerUser = mongoose.model('Manufacturer-user', schema)

module.exports = ManufacturerUser
