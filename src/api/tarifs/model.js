const { Schema, model, Schema: { Types: { ObjectId } } } = require('mongoose')
const { start, end } = require('./validation')
const schema = new Schema(
  {
    code: {
      type: Number,
      min: 0,
      max: 2,
      get: v => Math.round(v),
      set: v => Math.round(v),
      required: true
    },
    document: {
      type: ObjectId,
      required: true
    },
    start: {
      type: Date,
      validate: start,
      required: true
    },
    end: {
      type: Date,
      validate: end,
      required: true
    },
    amount: {
      type: Number,
      min: 0,
      required: true
    }
  },
  {
    timestamps: true
  }
)

schema.index({
  document: 1,
  start: 1,
  end: 1
}, {
  unique: true
})

const Model = model('Tarif', schema)

module.exports = Model
