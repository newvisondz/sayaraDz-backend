const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schema = new Schema({
  dealership: {
    type: String,
    required: true,
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

module.exports = schema
