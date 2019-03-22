const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
})

schema.methods.toJSON = function () {
  return {
    id: this.id,
    name: this.name
  }
}

module.exports = schema
