
module.exports = class Validation {
  constructor (schema) {
    if (!schema) throw new Error('not valid schema')
    this.schema = schema
    this.requiredPaths = schema.requiredPaths()
  }

  requiredPaths ({ body }, res, next) {
    for (let path of this.requiredPaths) {
      if (!body[path]) {
        return res.status(404).json({
          error: 1,
          msg: `${path} is required`
        })
      }
      next()
    }
  }
  sanitizeBody (req, res, next) {
    let body = {}
    this.schema.eachPath((path, type) => {
      if (req.body[path] !== undefined)body[path] = req.body[path]
    })
    req.body = body
    next()
  }

  filter (req, res, next) {
    let newQuery = {}
    this.schema.eachPath((path) => {
      if (req.query[path] !== undefined)newQuery[path] = req.query[path]
    })
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
}
