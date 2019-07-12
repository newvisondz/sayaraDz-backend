var admin = require('firebase-admin')

var serviceAccount = process.env.FCM

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
})

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://sayaradz-9d20c.firebaseio.com'
// })
// var registrationToken = 'c-cDFk3zhYI:APA91bEf8tZ4DnIEnqK0MXmFsPLkLkI9OUeXbExkdsRqTNYhbU4Lwoles5MVekMwnruB5KXPVq4h2UHgFCXqTD4RfJTcfyFr0qbC4BPA4kJTgmkS89XUIR6CRKYnBwFG8_vcyqhDIAK9'
// var registrationToken = ' dbd-urTmTCA:APA91bGo7g85-Hu2iIK45QuvagBE-25KSbvt77_zf0ffRiADZld8Kz-p0HBPhAk8LIWy9K-dk7Lpv4wOqvCx3mYiN84cBZMg4wSOkIz8bu5nV0NbJCZo0zY5Qyh7q-Yu0q4YTpGjjw9P'
exports.notify = (payload = {
  // data: {
  //   score: 'Version',
  //   time: '1505080b'
  // },
  // notification: {
  //   title: 'multicast test',
  //   body: ''
  // }
}, tokens = []) => {
  if (!tokens.length) return
  var message = {
    ...payload,
    tokens
  }

  admin.messaging().sendMulticast(message)
    .then((response) => {
      if (response.failureCount > 0) {
        const failedTokens = []
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx])
          }
        })
        console.log('List of tokens that caused failures: ' + failedTokens)
      }
      console.log('success .... ')
    })
    .catch((error) => {
      console.log('Error sending message:', error)
    })
}
