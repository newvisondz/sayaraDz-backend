const { isFabricant, isFabricantAdmin, authenticated } = require('../../services/acl')
const http = require('../../services/http')

const permissions = [
  isFabricant,
  isFabricantAdmin,
  authenticated
]
exports.read = [
  ...permissions,
  async ({ model }, res, next) => {
    http.ok(res, model.versions)
  }
]

exports.create = [
  ...permissions,
  async ({ model, body }, res, next) => {
    const newVersion = model.versions.create(body)
    try {
      model.versions.push(newVersion)
      await model.save()
      http.ok(res, newVersion)
    } catch (error) {
      http.internalError(res, error)
    }
  }
]

exports.update = [
  ...permissions,
  checkVersion,
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
      http.internalError(res, error)
    }
  }
]

exports.deleteOne = [
  ...permissions,
  checkVersion,
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

function checkVersion (req, res, next) {
  const { model: { versions }, params: { id } } = req
  const version = versions.id(id)
  if (version) return next()
  http.notFound(res, {
    error: true,
    msg: 'version not found'
  })
}
