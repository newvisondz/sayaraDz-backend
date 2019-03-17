const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { isAlphanumeric, blacklist } = require('validator')
const ManufacturerUser = require('../manufacturer-user/model')
const schema = new Schema({
  marque: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => isAlphanumeric(blacklist(value, ' '))
  },
  logo: {
    type: String
  }
}, {
  timestamps: true
})

schema.methods.toJSON = function () {
  return {
    id: this.id,
    marque: this.marque,
    logo: this.logo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    admins: this.admins
  }
}
schema.pre('deleteOne', async (next) => {
  await ManufacturerUser.deleteMany({ manufacturer: this.id })
})

schema.plugin(require('mongoose-keywords'), { paths: ['marque'] })

const model = mongoose.model('fabricant', schema)
module.exports = model
