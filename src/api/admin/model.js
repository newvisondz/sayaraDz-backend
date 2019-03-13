const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const {
  preSaveUser,
  isValidPasswd,
  sign,
  USER_TYPE } = require('../utils')

const AdminSchema = new Schema({
  email: {
    type: String,
    index: true,

    unique: true,
    require: true,
    validate: validator.isEmail,
    trim: true
  },
  password: {
    type: String,
    require: true,
    minlength: 4
  }
}, {
  timestamps: true
})

AdminSchema.pre('save', preSaveUser)

AdminSchema.methods.isValidPasswd = isValidPasswd

AdminSchema.methods.sign = sign

AdminSchema.virtual('type').get(() => USER_TYPE.ADMIN)
// for testing admins
AdminSchema.methods.toJSON = function () {
  return {
    email: this.email,
    id: this.id,
    token: this.token
  }
}

AdminSchema.statics.type = () => USER_TYPE.ADMIN

const AdminModel = mongoose.model('Admin', AdminSchema)

module.exports = AdminModel
