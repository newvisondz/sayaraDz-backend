const mongoose = require('mongoose')
const { timestamps } = require('../../services/validation')

const Schema = mongoose.Schema
const schema = new Schema({
  vin: {
    type: Number,
    required: true
  },
  dealership: {
    type: String,
    trim: true
  },
  colors: {
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

const model = mongoose.model('Vehicle', schema)

module.exports = model
