const ObjectId = require('mongoose').Types.ObjectId

function handleIdParams (_id, res) {
  const isValid = ObjectId.isValid(_id)
  if (!isValid) {
    res.json({
      error: true,
      msg: 'bad ID'
    })
  }
  return isValid
}

module.exports = (Model, name, filter) => ({

  read: async ({querymen: {query, select, cursor}}, res, next) => {
    try {
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
      const newModel = await new Model(body).save()
      res.json(newModel)
      next()
    } catch (error) {
      if (error.code == 11000) {
        return res.json({
          error: 1,
          msg: 'duplicate ' + name
        })
      }
      res.json(error)
      next(error)
    }
  },

  update: async ({ params, body }, res, next) => {
    const { id } = params
    if (!handleIdParams(id, res)) return
    delete body.id
    delete body._id
    try {
      const newFilter = {
        _id: id,
        ...filter
      }
      const result = await Model.updateOne(newFilter, body)
      res.json(result)
      next()
    } catch (error) {
      res.json(error)
      next(error)
    }
    next()
  },

  deleteOne: async ({ params, body }, res, next) => {
    const _id = params.id
    if (!handleIdParams(_id, res)) return
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
