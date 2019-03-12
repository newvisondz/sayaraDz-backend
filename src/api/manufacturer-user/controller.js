const { authenticated, isFabricantAdmin } = require('../../services/acl')
const ManufacturerUser = require('./model')
const ObjectId = require('mongoose').Types.ObjectId
const Validation = require('../../services/validation')

const validate = new Validation(ManufacturerUser.schema)
exports.index = [
  isFabricantAdmin,
  authenticated,
  validate.filter.bind(validate),
  async ({ query, options: { limit, skip, sort } }, res) => {
    try {
      const filter = {
        ...query,
        isAdmin: false
      }
      const users = await ManufacturerUser
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec()
      const count = await ManufacturerUser.countDocuments(filter)
      res.json({
        users,
        count
      })
    } catch (error) {
      res.json(error)
    }
  }
]

exports.create = [
  isFabricantAdmin,
  authenticated,
  validate.requirePaths.bind(validate),
  async ({ body }, res) => {
    try {
      const admin = await new ManufacturerUser({
        ...body,
        isAdmin: false
      }).save()
      res.json(admin)
    } catch (error) {
      if (error.code == 11000) {
        return res.json({
          error: 1,
          msg: 'duplicated manufacturer admin'
        })
      }
      res.json(error)
    }
  }
]

exports.update = [
  isFabricantAdmin,
  authenticated,
  async ({ params, body }, res) => {
    const { id } = params
    if (!handleIdParams(id, res)) return
    const result = await ManufacturerUser.updateOne({ _id: id }, body)
    res.json(result)
  }
]

exports.deleteOne = [
  isFabricantAdmin,
  authenticated,
  async (req, res) => {
    const _id = req.params.id
    if (!handleIdParams(_id, res)) return
    try {
      const result = await ManufacturerUser.deleteOne({ _id })
      res.json(result)
    } catch (error) {
      res.json(error)
    }
  }
]

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

// new ManufacturerUser({
//   email: 'akram@gmail.dz',
//   school: 'esi',
//   password: 'root',
//   isAdmin: false,
//   manufacturer: '5c744a029e7aaf23b87381ad'
// })
//   .save()
//   .then(console.log)
//   .catch(console.log)
