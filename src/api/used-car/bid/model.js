const { Schema, model } = require('mongoose')

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
    required: String
  },
  accepted: {
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
      creator: this.creator,
      usedCar: this.usedCar,
      createdAt: this.createdAt,
      price: this.price
    }
  }
}

const Model = model('Bid', schema)

module.exports = Model
