const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  amount: Number,
  accepted: {
    type: Boolean,
    default: false
  },
  processed: {
    type: Boolean,
    default: false
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
    amount: this.amount,
    vehicle: this.vehicle,
    accepted: this.accepted || false,
    processed: this.processed || false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

const Command = mongoose.model('Commande', schema)

module.exports = Command
