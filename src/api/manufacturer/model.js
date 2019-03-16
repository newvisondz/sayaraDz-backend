const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const schema = new Schema({
  marque: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isAlphanumeric
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
    updatedAt: this.updatedAt
  }
}

schema.plugin(require('mongoose-keywords'), {paths: ['marque']});

const model = mongoose.model('fabricant', schema)
module.exports = model
