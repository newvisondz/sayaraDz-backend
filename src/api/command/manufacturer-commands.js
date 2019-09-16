const { notFound, ok, badRequest } = require('../../services/http')
const { findCommandById } = require('./resolvers')
const joi = require('@hapi/joi')
const { validate } = require('../utils/validation')
const { Router } = require('express')
const { isUser, authenticated } = require('../../services/acl')
const { notify } = require('../../services/fcm')
const Automobiliste = require('../automobiliste/model')
const { createNotFoundError } = require('../utils')
const Vehicle = require('../vehicle/model')
const Command = require('./model')
const querymen = require('querymen')

const list = [
  isUser,
  authenticated,
  querymen.middleware({
    accepted: Boolean,
    payed: Boolean
  }),
  async ({ manufacturer, querymen: { query, select, cursor } }, res, next) => {
    try {
      const commands = await Command.find(
        { ...query, manufacturer: manufacturer.id },
        select,
        cursor
      ).populate('automobiliste', 'id firstName lastName phone address')
        .populate('vehicle', 'id images')
        .exec()
      const count = await Command.count(query)
      ok(res, { commands, count })
    } catch (error) {
      console.error(error)
      badRequest(res, error)
    }
  }
]

const updateBodySchema = joi.object().keys({
  accepted: joi.boolean().required()
})

const update = [
  isUser,
  authenticated,
  validate(updateBodySchema),
  async ({ manufacturer, body, params: { id }, user }, res, next) => {
    try {
      // const commands = await listManufacturerCommands(manufacturer.id)

      // const command = commands.find(
      //   c => c.id == id
      // )
      const command = await findCommandById(id, user.manufacturer)
      if (!command) return notFound(res, createNotFoundError('command', id))
      const oldCommand = await Command.findOne({
        vehicle: command.vehicle,
        accepted: true
      }).nin('_id', [command.id])

      if (oldCommand || !command || (command && command.payed)) {
        return notFound(res, createNotFoundError('command', id))
      }

      command.set(body)

      await command.save()

      await Vehicle.updateOne({
        _id: command.vehicle
      }, {
        ordered: body.accepted
      })
      res.json(command)

      const autom = await Automobiliste.findById(command.automobiliste)
      // console.log(command.automobiliste)
      notify({
        notification: {
          title: 'Your Command is ' + (body.accepted ? 'Accepted' : 'Rejected')
        },
        topic: autom.id
      })
    } catch (error) {
      console.error(error)
      badRequest(res, error)
      throw error
    }
  }
]

// module.exports = { list, update }

const router = new Router()

router.get('/', list)
router.put('/:id', update)

module.exports = router
