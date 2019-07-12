const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const utils = require('../utils')
const Command = require('../command/model')

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
    token: this.token,
    commands: this.commands
  }
}

AutoMobilisteSchema.statics.type = () => utils.USER_TYPE.AUTOMOBILISTE
AutoMobilisteSchema.methods.findCommands = async function () {
  this.commands = await Command.find({ automobiliste: this.id })
}
const Automobiliste = mongoose.model('Automobiliste', AutoMobilisteSchema)
// new Automobiliste({
//   email: 'r@root.dz',
//   password: 'root'
// }).save().then(user => console.log(user.sign()))
// Automobiliste.find({}).then(docs => docs[5].sign()).then(console.log)
module.exports = Automobiliste
