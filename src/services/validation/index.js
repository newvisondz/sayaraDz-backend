class Validation {
  constructor (schema) {
    if (!schema) throw new Error('not valid schema')
    this.schema = schema
    this.requiredPaths = schema.requiredPaths()
  }

  requirePaths ({ body }, res, next) {
    for (let path of this.requiredPaths) {
      if (!body[path]) {
        return res.status(404).json({
          error: 1,
          msg: `${path} is required`
        })
      }
    }
    next()
  }

  filter (req, res, next) {
    let newQuery = this.sanitize(req.query)
    const { select, page, perpage, sort } = req.query
    req.options = {
      select,
      sort,
      limit: parseInt(perpage),
      skip: (parseInt(page) - 1) * parseInt(perpage)
    }
    req.query = newQuery
    next()
  }
  sanitize (param) {
    let newParam = {}
    this.schema.eachPath((path, type) => {
      if (param[path] !== undefined)newParam[path] = param[path]
    })
    return newParam
  } 
}

Validation.timestamps = {
  after: {
    type: Date,
    paths: ['createdAt'],
    operator: '$gte',
  },
  before: {
    type: Date,
    paths: ['createdAt'],
    operator: '$lte'
  }
}

module.exports = Validation