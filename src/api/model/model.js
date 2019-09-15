const mongoose = require('mongoose')
const option = require('../option/model')
const version = require('../version/model')
const color = require('../color/model')
const { retrievedOptions } = require('../utils')
const Schema = mongoose.Schema
// const Vehicle = require('../vehicle/model')

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    ref: 'fabricant'
  },
  options: [option],
  versions: [version],
  colors: [color],
  images: [String]
})

schema.methods.toJSON = function (next) {
  return {
    id: this.id,
    name: this.name,
    colors: this.colors,
    options: retrievedOptions(this.options),
    versions: this.versions,
    images: this.images
  }
}

schema.plugin(require('mongoose-keywords'), { paths: ['name'] })

const model = mongoose.model('Model', schema)

// model.find({
//   'versions._id': '5d206bf96fffac001957a664'
// }).select('versions').then(console.log).catch(console.error)

module.exports = model

// model.updateOne({ _id: '5c9e433f1b816d541b172ec2' }, {
//   options: [
//     { name: 'radar', value: 'off' },
//     { name: 'radar', value: 'hi' },
//     { name: 'rer', value: 'poi' },
//     { name: 'rer', value: 'opo' }
//   ]
// }).then(console.log)

// model.find().then(
//   models => {
//     models.forEach(
//       model => model.versions.forEach(
//         version => {
//           // console.log(version.vehicles)
//           Vehicle.updateMany({
//             _id: version.vehicles
//           }, {
//             version: version.id
//           }).then(res => console.log({ ok: res.ok, n: res.n }))
//         }
//       ))
//   }
// )
