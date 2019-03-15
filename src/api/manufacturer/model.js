const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const ManufacturerSchema = new Schema({
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

ManufacturerSchema.methods.toJSON = function () {
  return {
    id: this.id,
    marque: this.marque,
    logo: this.logo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}
const ManufacturerModel = mongoose.model('fabricant', ManufacturerSchema)

module.exports = ManufacturerModel
