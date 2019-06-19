const Commande = require('./model')
const { isAutomobiliste, authenticated } = require('../../services/acl')
const { ok, badRequest, notFound, internalError } = require('../../services/http')

// all routes secured with automobiliste authorization, we will add user, admin manufacturer authorization when working on command accept and reject


exports.list = [
  isAutomobiliste,
  authenticated,
  async({ params: { page: _page }, user: { id: automobiliste } }, res) => {
    var perPage = 2
    var page = _page || 1
    try {
      const commandes = await Commande
        .find({automobiliste})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        if (!commandes) ok(res, "Aucune commande")
        else            ok(res, commandes)
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
      let vehicule = body.vehicule;
      const fetchTest = await Commande.findOne({vehicule, automobiliste})
      if (fetchTest) badRequest(res, {
        error: true,
        msg: `commande <${fetchTest.id}> exist`
      })
      const command = await new Commande({ ...body, automobiliste }).save()
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
  msg: `${model}<${id}> not found`
})
