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
  birthDate: Date,
  providers: [{
    name: {
      type: String,
      enum: providers
    },
    id: {
      type: String
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
  return {
    id: this.id,
    email: this.email,
    providers: this.providers,
    firstName: this.firstName,
    lastName: this.lastName,
    birthDate: this.birthDate,
    phone: this.phone,
    address: this.address,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    token: this.token
  }
}

AutoMobilisteSchema.statics.type = () => utils.USER_TYPE.AUTOMOBILISTE

const Automobiliste = mongoose.model('Automobiliste', AutoMobilisteSchema)
// new Automobiliste({
//   email: 'r@root.dz',
//   password: 'root'
// }).save().then(user => console.log(user.sign()))
module.exports = Automobiliste

//current Token on Automobilist
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDkyYTQxNzBjYjllMmFhOGNlMWQzMCIsInR5cGUiOiJBVVRPTU9CSUxJU1RFIiwiaWF0IjoxNTYwODgxNzMyLCJleHAiOjE1Njk0MzUzMzJ9.nhqvZP1-tC5XQe3zx20FoURmedgpo6wtAelbwJqr0yc