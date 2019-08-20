const mongoose = require('mongoose')
const { Schema, model } = mongoose

const schema = new Schema({
  title: {
    type: String
  },
  owner: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  currrentMiles: {
    type: Number
  },
  registrationDate: {
    type: Date,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  minPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

schema.methods = {
  toJSON: function () {
    return {
      id: this.id,
      title: this.title,
      manufacturer: this.manufacturer,
      model: this.model,
      version: this.version,
      currrentMiles: this.currrentMiles,
      registrationDate: this.registrationDate,
      color: this.color,
      images: this.images,
      minPrice: this.minPrice,
      owner: this.owner
    }
  }
}

schema.plugin(require('mongoose-keywords'), { paths: ['title', 'manufacturer', 'model', 'version'] })

const Model = model('UsedCar', schema)

module.exports = Model
