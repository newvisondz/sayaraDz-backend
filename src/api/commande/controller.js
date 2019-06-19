const Commande = require('./model')
const { isAutomobiliste, authenticated } = require('../../services/acl')
const { ok, badRequest, notFound, internalError } = require('../../services/http')
const querymen = require('querymen')
const Vehicle = require('../vehicle/model')
// all routes secured with automobiliste authorization, we will add user, admin manufacturer authorization when working on command accept and reject

exports.list = [
  isAutomobiliste,
  authenticated,
  querymen.middleware({}), // check docs: https://www.npmjs.com/package/querymen
  async ({ user: { id: automobiliste }, querymen: { query, select, cursor } }, res) => {
    try {
      const commandes = await Commande.find({ ...query, automobiliste }, select, cursor)
      const count = await Commande.countDocuments({ ...query, automobiliste })
      ok(res, { commandes, count })
    } catch (error) {
      badRequest(res, error)
    }
  }
]

exports.create = [
  isAutomobiliste,
  authenticated,
  async ({ body, user: { id: automobiliste } }, res) => {
    try {
      const exists = await !!Vehicle.findOne({ _id: body.vehicule }).select({ _id: 1 }).lean()
      if (!exists) return notFound(res, createNotFoundError('vehicle', body.vehicule))
      const command = await new Commande({ ...body, automobiliste }).save()
      ok(res, command)
    } catch (error) {
      console.error(error)
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
        return notFound(res, createNotFoundError('commande ', _id))
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
      } else notFound(res, createNotFoundError('commande ', _id))
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
      } else notFound(res, createNotFoundError('commande ', _id))
    } catch (error) {
      internalError(res, error)
    }
  }
]

const createNotFoundError = (model, id) => ({
  error: true,
  code: 404,
  msg: `${model}<${id}> not found`
})
