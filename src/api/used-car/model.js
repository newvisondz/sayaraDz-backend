const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { INITIAL } = require('./states')

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
  manufacturerId: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  modelId: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  versionId: {
    type: String,
    required: true
  },
  currentMiles: {
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
  },
  state: {
    type: String,
    default: INITIAL
  },
  sold: {
    type: Boolean,
    default: false
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
      manufacturerId: this.manufacturerId,
      model: this.model,
      modelId: this.modelId,
      version: this.version,
      versionId: this.versionId,
      currentMiles: this.currentMiles,
      registrationDate: this.registrationDate,
      color: this.color,
      images: this.images,
      minPrice: this.minPrice,
      owner: this.owner,
      createdAt: this.createdAt
    }
  }
}

schema.plugin(require('mongoose-keywords'), { paths: ['title', 'manufacturer', 'model', 'version'] })

const Model = model('UsedCar', schema)

// Model.updateMany({}, {
//   sold: false,
//   state: INITIAL
// }).then(console.log)

module.exports = Model
