const Model = require('./model')

const getPrice = async document => {
  let res = await Model.find({
    document,
    start: {
      '$lte': new Date()
    },
    end: {
      '$gte': new Date()
    }
  }).sort('-createdAt')

  return (res[0] && res[0].amount) || 0
}

const getTotalPrice = async (...documents) => {
  const tarifs = await Promise.all(documents.map(d => getPrice(d)))
  console.log({ documents })
  return tarifs.reduce(
    (previous, current) => previous + current, 0
  )
}

module.exports = {
  getPrice,
  getTotalPrice
}
