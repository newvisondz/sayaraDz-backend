const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const { isAlphanumeric, blacklist } = require('validator')
const ManufacturerUser = require('./user/model')
const schema = new Schema({
  _id: {
    type: String
  },
  brand: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 1
  },
  logo: {
    type: String,
    default: '/public/images/logo.png'
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
    admins: this.admins,
    users: this.users
  }
}
schema.pre('save', function (next) {
  this._id = this.brand.replace(/ /g, '-').replace(/\//g, '_')
  next()
})
schema.pre('deleteOne', async (next) => {
  await ManufacturerUser.deleteMany({ manufacturer: this.id })
})

schema.plugin(require('mongoose-keywords'), { paths: ['brand'] })

const model = mongoose.model('fabricant', schema)
module.exports = model
