const { internalError, notFound } = require('../../services/http')
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

const list = [
  isUser,
  authenticated,
  async ({ manufacturer }, res, next) => {
    try {
      const commands = await Command.find({ manufacturer: manufacturer.id })
        .populate('automobiliste', 'id firstName lastName phone address')
        .populate('vehicle', 'id images')
      console.log(commands)
      res.json({ commands })
    } catch (error) {
      console.error(error)
      internalError(res, error)
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

      notify({
        data: {
          module: 'command',
          id,
          accepted: body.accepted
        },
        topic: autom.id
      }).then(console.log)
    } catch (error) {
      console.error(error)
      internalError(res, error)
      throw error
    }
  }
]

// module.exports = { list, update }

const router = new Router()

router.get('/', list)
router.put('/:id', update)

module.exports = router
