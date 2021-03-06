const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const utils = require('../utils')
const Command = require('../command/model')

const providers = ['google', 'facebook']

const AutoMobilisteSchema = new Schema({
  uid: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    index: true,
    // unique: true,
    validate: validator.isEmail,
    trim: true
  },
  tokens: {
    type: [String]
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
  },
  followedVersions: {
    type: [Schema.Types.ObjectId]
  },
  picture: String,
  paymentAccount: Schema.Types.Mixed,
  stripeAccountIds: [String],
  validStripeAccountId: String
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
    commands: this.commands,
    followedVersions: this.followedVersions,
    picture: this.picture,
    uid: this.uid,
    paymentAccount: this.paymentAccount,
    stripeAccountId: this.stripeAccountId

    // tokens: thi  s.tokens
  }
}

AutoMobilisteSchema.methods.profileView = function () {
  return {
    id: this.id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    birthDate: this.birthDate,
    phone: this.phone,
    address: this.address,
    picture: this.picture
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
// Automobiliste.find({}).then(docs => docs[0].sign()).then(console.log)
module.exports = Automobiliste
