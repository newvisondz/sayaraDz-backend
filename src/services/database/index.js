const mongoose = require('mongoose')
const keys = process.env

module.exports = (cb) => {
  mongoose.set('useNewUrlParser', true)
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)
  mongoose.Promise = global.Promise
  mongoose.connect(keys.mongoUrl, {
    useNewUrlParser: true
  })
    .then(
      () => {
        console.log('database connected')
        if (cb) cb(null)
      },
      (err) => {
        if (cb) cb(err)
      }
    )
}
