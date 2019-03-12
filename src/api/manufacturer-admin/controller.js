const {
  isAdmin,
  authenticated
} = require('../../services/acl')
const ManufacturerUser = require('../manufacturer-user/model')
const ObjectId = require('mongoose').Types.ObjectId
const Validation = require('../../services/validation')

const validate = new Validation(ManufacturerUser.schema)
exports.index = [
  isAdmin,
  authenticated,
  validate.filter.bind(validate),
  async ({ query, options: { select, limit, skip, sort } }, res) => {
    try {
      const filter = {
        ...query,
        isAdmin: true
      }
      const admins = await ManufacturerUser
        .find(filter)
        .select(select)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec()
      const count = await ManufacturerUser.countDocuments(filter)
      res.json({
        admins,
        count
      })
    } catch (error) {
      res.json(error)
    }
  }
]

exports.update = [
  isAdmin,
  authenticated,
  validate.sanitizeBody.bind(validate),
  async ({
    params,
    body
  }, res) => {
    const {
      id
    } = params
    if (!handleIdParams(id, res)) return
    const result = await ManufacturerUser.updateOne({
      _id: id
    }, body)
    res.json(result)
  }
]

exports.deleteOne = [
  isAdmin,
  authenticated,
  async (req, res) => {
    const _id = req.params.id
    if (!handleIdParams(_id, res)) return
    try {
      const result = await ManufacturerUser.deleteOne({
        _id
      })
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
      msg: 'bad manufacturer admin id'
    })
  }
  return isValid
}

// new ManufacturerUser({
//   email: 'akram@esi.dz',
//   password: 'root',
//   isAdmin: false,
//   manufacturer: '5c744a029e7aaf23b87381ad'
// })
//   .save()
//   .then(console.log)
//   .catch(console.log)
