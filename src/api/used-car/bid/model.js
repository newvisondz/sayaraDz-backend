const { Schema, model } = require('mongoose')

const schema = new Schema({
  owner: {
    type: String,
    required: true
  },
  usedCar: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: String
  }
}, {
  timestamps: true
})

schema.methods = {
  toJSON: function () {
    return {
      id: this.id,
      owner: this.owner,
      usedCar: this.usedCar,
      createdAt: this.createdAt,
      price: this.price
    }
  }
}

const Model = model('Bid', schema)

module.exports = Model
