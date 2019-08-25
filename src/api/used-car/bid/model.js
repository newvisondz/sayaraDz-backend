const { Schema, model } = require('mongoose')
const { INITIAL } = require('../states')

const schema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Automobiliste',
    required: true
  },
  usedCar: {
    type: Schema.Types.ObjectId,
    ref: 'UsedCar',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    default: INITIAL
  }
}, {
  timestamps: true
})

schema.methods = {
  toJSON: function () {
    return {
      id: this.id,
      creator: this.creator,
      usedCar: this.usedCar,
      price: this.price,
      state: this.state,
      createdAt: this.createdAt
    }
  }
}

const Model = model('Bid', schema)

module.exports = Model
