const server = require('./app')
const connect = require('./src/services/database')
const { port } = require('./src/config')

connect((err) => {
  if (!err) {
    server.connect(port)
  } else throw err
})
