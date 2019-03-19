const server = require('./app')
const connect = require('./src/services/database')

connect((err) => {
  if (!err) {
    console.log(process.env.PORT)
    const PORT = process.env.PORT || 3000
    server.connect(PORT)
  } else throw err
})
