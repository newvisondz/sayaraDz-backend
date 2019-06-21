const dotenv = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const auth = require('./src/services/passport')
const querymen = require('querymen')
const bodymen = require('bodymen')
const app = express()
const { upload_dir, static_folder } = process.env
const router = require('./src/api')
const cors = require('cors')
const http = require('./src/services/http')

app.use(cors())
// uploaded logos
app.use('/public', express.static(static_folder), (req, res, next) => {
  http.notFound(res)
})

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
      PORT,
      mode: process.env.NODE_ENV || 'development'
    })
  })
