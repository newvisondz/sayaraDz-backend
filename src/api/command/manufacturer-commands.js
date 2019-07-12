const { internalError, notFound } = require('../../services/http')
const { listManufacturerCommands } = require('./resolvers')
const joi = require('@hapi/joi')
const { validate } = require('../utils/validation')
const { createNotFoundError } = require('../utils')
const { Router } = require('express')
const { isUser, authenticated } = require('../../services/acl')

const list = [
  isUser,
  authenticated,
  async ({ manufacturer }, res, next) => {
    try {
      const commands = await listManufacturerCommands(manufacturer.id)
      res.json({ commands })
    } catch (error) {
      console.error(error)
      internalError(res, error)
    }
  }]
const updateBodySchema = joi.object().keys({
  accepted: joi.boolean().required()
})

const update = [
  isUser,
  authenticated,
  validate(updateBodySchema),
  async ({ manufacturer, body, params: { id } }, res, next) => {
    try {
      const commands = await listManufacturerCommands(manufacturer.id)

      const command = commands.find(
        c => c.id == id
      )
      if (!command || (command && command.processed)) {
        return notFound(res, createNotFoundError('command', id))
      }

      command.set({
        ...body,
        processed: true
      })
      await command.save()
      res.json(command)
    } catch (error) {
      internalError(res, error)
      throw error
    }
  }
]

module.exports = { list, update }

const router = new Router()

router.get('/', list)
router.put('/:id', update)

module.exports = router
