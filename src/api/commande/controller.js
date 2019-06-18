const Commande = require('./model')
const { isAutomobiliste, authenticated } = require('../../services/acl')
const { ok, badRequest, notFound, internalError } = require('../../services/http')

// all routes secured with automobiliste authorization, we will add user, admin manufacturer authorization when working on command accept and reject

exports.list = [
  isAutomobiliste,
  authenticated,
  async ({ user: { id: automobiliste } }, res) => {
    // TODO pagination
    try {
      const commands = await Commande.find({ automobiliste })
      ok(res, commands)
    } catch (error) {
      internalError(res, error)
    }
  }
]

exports.create = [
  isAutomobiliste,
  authenticated,
  async ({ body, user: { id: automobiliste } }, res) => {
    try {
      const command = await new Commande({ ...body, automobiliste }).save()
      // TODO --> verify vehicle exists esle send notfound
      ok(res, command)
    } catch (error) {
      badRequest(res, error)
    }
  }
]

exports.show = [
  isAutomobiliste,
  authenticated,
  async ({ params: { id: _id }, user: { id: automobiliste } }, res) => {
    try {
      const command = await Commande.findOne({ _id, automobiliste })
      if (!command) {
        return notFound(res, createError('command', _id))
      }
      ok(res, command)
    } catch (error) {
      internalError(res, error)
    }
  }]

exports.update = [
  isAutomobiliste,
  authenticated,
  async ({ params: { id: _id }, body, user: { id: automobiliste } }, res) => {
    try {
      const result = await Commande.updateOne({ _id, automobiliste }, body)
      if (result.ok && result.n) {
        ok(res, result)
      } else notFound(res, createError('command', _id))
    } catch (error) {
      internalError(res, error)
    }
  }]

exports.deleteOne = [
  isAutomobiliste,
  authenticated,
  async ({ params: { id: _id }, user: { id: automobiliste } }, res) => {
    try {
      const result = await Commande.deleteOne({ _id, automobiliste })
      if (result.ok && result.n) {
        ok(res, result)
      } else notFound(res, createError('command', _id))
    } catch (error) {
      internalError(res, error)
    }
  }
]

const createError = (model, id) => ({
  error: true,
  msg: `${model}<${id}> not found`
})
