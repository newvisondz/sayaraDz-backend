const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  amount: Number,
  accepted: {
    type: Boolean,
    default: false
  },
  done: {
    type: Boolean
  },
  automobiliste: {
    type: Schema.Types.ObjectId,
    ref: 'Automobiliste',
    required: true
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  }
}, {
  timestamps: true
})

schema.index({ 'automobiliste': 1, 'vehicle': 1 }, { 'unique': true })

schema.methods.toJSON = function () {
  return {
    id: this._id,
    automobiliste: this.automobiliste,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    amount: this.amount,
    vehicle: this.vehicle,
    accepted: this.accepted
  }
}

const Command = mongoose.model('Commande', schema)

module.exports = Command
