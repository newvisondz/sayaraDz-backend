const mongoose = require('mongoose')
const Schema = mongoose.Schema
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
  models: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model'
  }],
  logo: {
    type: String
  },
  paymentAccount: Schema.Types.Mixed,
  stripeAccountIds: [String],
  validStripeAccountId: String
}, {
  timestamps: true,
  skipVersioning: { dontVersionMe: true }
})

schema.methods.toJSON = function () {
  return {
    id: this.id,
    brand: this.brand,
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
schema.pre('deleteOne', async function (next) {
  await ManufacturerUser.deleteMany({ manufacturer: this.id })
  next()
})

schema.plugin(require('mongoose-keywords'), { paths: ['brand'] })

const model = mongoose.model('fabricant', schema)
module.exports = model
