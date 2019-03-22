const mongoose = require('mongoose')
const option = require('../option/model')
const version = require('../version/model')
const color = require('../color/model')

const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  options: [option],
  versions: [version],
  colors: [color]
})

schema.metho.toJSON = function (next) {
  return {
    id: this.id,
    name: this.name,
    colors: this.colors,
    options: this.options,
    versions: this.versions
  }
}

const model = mongoose.model('Model', schema)

module.exports = model
