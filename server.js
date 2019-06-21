const server = require('./app')
const connect = require('./src/services/database')
const { PORT } = process.env

connect((err) => {
  if (!err) {
    server.connect(PORT)
  } else throw err
})
