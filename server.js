const server = require('./app')
const connect = require('./src/services/database')
const { port } = process.env

connect((err) => {
  if (!err) {
    server.connect(port)
  } else throw err
})
