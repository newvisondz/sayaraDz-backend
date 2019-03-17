const http = require('../http')

module.exports = (Model, name, filter) => ({

  read: async ({ querymen: { query, select, cursor } }, res, next) => {
    try {
      delete query.password
      const result = await Model.find(query, select, cursor)
      const count = await Model.countDocuments(query)
      res.json({
        [name + 's']: result,
        count
      })
      next()
    } catch (error) {
      res.json(error)
      next(error)
    }
  },

  create: async ({ body }, res, next) => {
    try {
      delete body._id
      const newModel = await new Model(body).save()
      res.json(newModel)
      next()
    } catch (error) {
      if (error.code == 11000) {
        return http.badRequest(res, {
          errors: {
            duplicated: {
              code: 11000,
              errmsg: error.errmsg,
              kind: 'duplicated'
            }
          }
        })
      }
      res.json(error)
      next(error)
    }
  },

  update: async ({ params, body }, res, next) => {
    const { id } = params
    delete body.id
    delete body._id
    try {
      const newFilter = {
        _id: id,
        ...filter
      }
      const result = await Model.updateOne(newFilter, body, { runValidators: true })
      res.json(result)
      next()
    } catch (error) {
      if (error.code == 11000) {
        return res.json({
          errors: {
            duplicated: {
              code: 11000,
              errmsg: error.errmsg,
              kind: 'duplicated'
            }
          }
        })
      }
      res.json(error)
      next(error)
    }
    next()
  },

  deleteOne: async ({ params, body }, res, next) => {
    const _id = params.id
    try {
      const result = await Model.deleteOne({ _id, ...body })
      res.json(result)
      next()
    } catch (error) {
      res.json(error)
      next(error)
    }
  }

})
