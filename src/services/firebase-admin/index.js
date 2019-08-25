var admin = require('firebase-admin')

var serviceAccount = process.env.FCM

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
})

module.exports = admin
