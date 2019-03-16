const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const auth = require('./src/services/passport')
const querymen = require('querymen')
const bodymen = require('bodymen')
const app = express()

const router = require('./src/api')
const cors = require('cors')

app.use(cors())
//uploaded logos
app.use('/public',express.static('public'))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

auth(app)

// define principle routes
app.use('/', router)
app.use(querymen.errorHandler())
app.use(bodymen.errorHandler())
exports.connect = (PORT) =>
  app.listen(PORT, (err) => {
    if (err) throw err
    console.log({
      listening: true,
      PORT
    })
    console.log({
      mode: process.env.NODE_ENV || 'development'
    })
  })
