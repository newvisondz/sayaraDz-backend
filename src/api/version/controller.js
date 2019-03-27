const { isFabricant, isFabricantAdmin, authenticated, isAutomobiliste } = require('../../services/acl')
const http = require('../../services/http')

const permissions = [
  isFabricant,
  isFabricantAdmin
]
exports.read = [
  isAutomobiliste,
  ...permissions,
  authenticated,
  async ({ model }, res, next) => {
    http.ok(res, model.versions)
  }
]

exports.create = [
  ...permissions,
  authenticated,
  async ({ model, body }, res, next) => {
    const newVersion = model.versions.create(body)
    try {
      model.versions.push(newVersion)
      await model.save()
      http.ok(res, newVersion)
    } catch (error) {
      http.badRequest(res, error)
    }
  }
]

exports.update = [
  ...permissions,
  authenticated,
  async ({ body, model, params: { id } }, res, next) => {
    const version = model.versions.id(id)
    version.set(body)
    try {
      await model.save()
      http.ok(res, {
        ok: 1,
        n: 1,
        nModified: 1
      })
    } catch (error) {
      http.badRequest(res, error)
    }
  }
]

exports.deleteOne = [
  ...permissions,
  authenticated,
  async ({ model, params: { id } }, res, next) => {
    const version = model.versions.id(id)
    version.remove()
    try {
      await model.save()
      http.ok(res, {
        ok: 1,
        n: 1,
        nDeleted: 1
      })
    } catch (error) {
      http.internalError(res, error)
    }
  }
]
