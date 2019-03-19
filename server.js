const server = require('./app')
const connect = require('./src/services/database')

connect((err) => {
  if (!err) {
    console.log(process.env)
    const PORT = process.env.PORT ||
      process.env.NODE_ENV == 'production' ? 8080 : 3000
    server.connect(PORT)
  } else throw err
})
