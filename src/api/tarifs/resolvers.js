const moment = require('moment')
const Model = require('./model')

exports.getPrice = async document => {
  let res = await Model.find({ document }).sort('createdAt')
  res = res.filter(
    d => moment().isSameOrAfter(d.start) && moment().isSameOrBefore(d.end)
  )

  console.log({ res })
  return (res[0] && res[0].amount) || 0
}

exports.getTotalPrice = async (...documents) => {
  const tarifs = await Promise.all(documents.map(d => this.getPrice(d)))
  console.log({ documents })
  return tarifs.reduce(
    (previous, current) => previous + current
  )
}
