const mongoose = require('mongoose')
const { timestamps } = require('../../services/validation')
const fs = require('fs')
const Schema = mongoose.Schema
const { upload_dir } = require('../../config')
const schema = new Schema({
  vin: {
    type: Number,
    required: true
  },
  dealership: {
    type: String,
    trim: true
  },
  images: [String],
  color: {
    type: Schema.Types.ObjectId,
    ref: 'Color'
  },
  options: [{
    type: Schema.Types.ObjectId,
    ref: 'Option'
  }]
}, { timestamps: true })
schema.statics.querySchema = () => ({
  ...timestamps,
  vin: Number
})
schema.plugin(require('mongoose-keywords'), { paths: ['vin', 'dealership'] })
schema.methods.toJSON = function () {
  return {
    id: this.id,
    vin: this.vin,
    images: this.images,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    color: this.color,
    options: this.options
  }
}

const model = mongoose.model('Vehicle', schema)

module.exports = model
