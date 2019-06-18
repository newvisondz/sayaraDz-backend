const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommandeSchema = new Schema({
  date: Date,
  montant: Number,
  automobiliste: {
    type: Schema.Types.ObjectId,
    ref: 'Automobiliste',
    required : true
  },
  vehicule: {
    type: Schema.Types.ObjectId ,
    ref: 'Vehicle',
    required : true
  }
}, {
  timestamps: true
})

CommandeSchema.index({ "automobiliste": 1, "vehicule": 1}, { "unique": true });

CommandeSchema.methods.toJSON = function () {
  return {
    id: this.id,
    date: this.date,
    montant: this.montant,
    automobiliste: this.automobiliste,
    vehicule: this.vehicule
  }
}


const Commande = mongoose.model('Commande', CommandeSchema)
module.exports = Commande
