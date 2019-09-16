const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  amount: Number,
  accepted: {
    type: Boolean,
    default: null
  },
  payed: {
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
  },
  manufacturer: {
    type: String,
    ref: 'fabricant',
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
    accepted: this.accepted,
    payed: this.payed,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

const Command = mongoose.model('Commande', schema)
// Command.deleteMany().then(console.log)
module.exports = Command
// Command.deleteMany().then(console.log)
