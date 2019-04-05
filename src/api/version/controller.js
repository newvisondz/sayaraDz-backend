const http = require('../../services/http')

exports.read = [
  async ({ model }, res, next) => {
    http.ok(res, model.versions)
  }
]

exports.create = [
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
