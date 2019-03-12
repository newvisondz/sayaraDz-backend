
module.exports = class Validation {
  constructor (schema) {
    if (!schema) throw new Error('not valid schema')
    this.schema = schema
    this.requiredPaths = schema.requiredPaths()
    this.sanitize.bind(this)
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
  sanitize ({ body }, res, next) {
    let bodyObj = {}
    this.schema.eachPath((path, type) => {
      if (body[path] !== undefined)bodyObj[path] = body[path]
    })
    res.body = bodyObj
    next()
  }
}
