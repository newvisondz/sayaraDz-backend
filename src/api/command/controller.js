const Commande = require('./model')
const {
  isAutomobiliste,
  isUser,
  authenticated
} = require('../../services/acl')
const {
  ok,
  notFound,
  internalError,
  conflict,
  created
} = require('../../services/http')
const querymen = require('querymen')
const Vehicle = require('../vehicle/model')
const { validateCreateBody, validatePaymentBody } = require('./validation')
const { charge } = require('../payment/stripe')
const mongoose = require('mongoose')

exports.list = [
  isAutomobiliste,
  authenticated,
  querymen.middleware({
    accepted: Boolean,
    payed: Boolean
  }),
  async (
    { user, querymen: { query, select, cursor } },
    res
  ) => {
    try {
      const automobiliste = user.id
      console.log({ automobiliste })
      const commandes = await Commande.find(
        { ...query, automobiliste },
        select,
        cursor
      )
      const count = await Commande.countDocuments({ ...query, automobiliste })
      ok(res, { commandes, count })
    } catch (error) {
      conflict(res, error)
    }
  }
]

exports.create = [
  isAutomobiliste,
  authenticated,
  validateCreateBody,
  async ({ body, user: { id: automobiliste } }, res) => {
    try {
      const vehicle = await Vehicle.findOne({ _id: body.vehicle })
      // .select({ _id: 1, manufacturer: 1 })
      // console.log({ vehicle })
      if (!vehicle || vehicle.ordered || vehicle.sold) {
        return notFound(res, createNotFoundError('vehicle', body.vehicle))
      }
      console.log({
        ...body,
        automobiliste,
        manufacturer: vehicle.manufacturer
      })
      const command = await new Commande({
        ...body,
        automobiliste,
        manufacturer: vehicle.manufacturer

      }).save()
      created(res, command)
    } catch (error) {
      console.error(error)
      conflict(res, error)
    }
  }
]

exports.show = [
  isUser,
  authenticated,
  async ({ params: { id: _id }, user: { id: automobiliste } }, res) => {
    try {
      const command = await Commande.findOne({ _id, automobiliste })
      if (!command) {
        return notFound(res, createNotFoundError('commande ', _id))
      }
      ok(res, command)
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.pay = [
  isAutomobiliste,
  authenticated,
  validatePaymentBody,
  async ({ params: { id }, body: { token }, user }, res) => {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()
      const command = await Commande.findById(id)
      console.log({ command })
      if (!command || (command && (!command.accepted || command.payed))) {
        return notFound(res, createNotFoundError('commande ', id))
      }
      const vehicle = await Vehicle.findById(command.vehicle).populate(
        'manufacturer'
      )
      await charge(
        token,
        command.amount,
        vehicle.manufacturer.validStripeAccountId
      )
      command.payed = true
      vehicle.sold = true
      await command.save({ session })
      await vehicle.save({ session })
      session.commitTransaction()
      res.json({
        success: true
      })
    } catch (error) {
      session.abortTransaction()

      internalError(res, error)
    }
  }
]

// can not be updated by automobiliste
// exports.update = [
//   isUser,
//   authenticated,
//   validateUpdateBody,
//   async ({ params: { id: _id }, body, user: { id: automobiliste } }, res) => {
//     try {
//       const result = await Commande.updateOne({ _id, automobiliste }, body)
//       if (result.ok && result.n) {
//         ok(res, result)
//       } else notFound(res, createNotFoundError('commande ', _id))
//     } catch (error) {
//       internalError(res, error)
//     }
//   }
// ]

// exports.deleteOne = [
//   isAutomobiliste,
//   authenticated,
//   async ({ params: { id: _id }, user: { id: automobiliste } }, res) => {
//     try {
//       const result = await Commande.deleteOne({ _id, automobiliste, payed: false })
//       if (result.ok && result.n) {
//         ok(res, result)
//       } else notFound(res, createNotFoundError('commande ', _id))
//     } catch (error) {
//       internalError(res, error)
//     }
//   }
// ]

const createNotFoundError = (model, id) => ({
  error: true,
  code: 404,
  msg: `${model}<${id}> not found`
})
