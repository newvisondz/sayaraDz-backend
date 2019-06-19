const http = require('../../services/http')
const { verifyIds, retrievedOptions } = require('../utils')
const { filterById } = require('../utils')

exports.show = [
  ({ model, version }, res, next) => {
    let options = model.options.filter(
      o => version.options.find(
        opt => o.id == opt
      )
    )
    options = retrievedOptions(options)

    http.ok(res, {
      ...version.toJSON(),
      options,
      colors: filterById(version.colors, model.colors),
      vehicles: undefined
    })
  }
]

exports.read = [
  async ({ model }, res, next) => {
    http.ok(res, model.versions.map(
      v => {
        let options = model.options.filter(
          o => v.options.find(
            opt => o.id == opt
          )
        )
        options = retrievedOptions(options)
        return ({
          ...v.toJSON(),
          options,
          vehicles: undefined
        })
      }
    ))
  }
]

exports.create = [
  async ({ model, body }, res, next) => {
    const { options } = body
    if (options) {
      let id = verifyIds(options, model.options)
      if (id) {
        return http.badRequest(res, {
          error: true,
          msg: `option ${id} not found in model options`
        })
      }
    }

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
    const { options } = body
    let notFoundOption = verifyIds(options, model.options)
    if (notFoundOption) {
      return http.badRequest(res, {
        error: true,
        msg: `option ${notFoundOption} not found in model options`
      })
    }
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
