const admin = require('../firebase-admin')

// var registrationToken = 'c-cDFk3zhYI:APA91bEf8tZ4DnIEnqK0MXmFsPLkLkI9OUeXbExkdsRqTNYhbU4Lwoles5MVekMwnruB5KXPVq4h2UHgFCXqTD4RfJTcfyFr0qbC4BPA4kJTgmkS89XUIR6CRKYnBwFG8_vcyqhDIAK9'
// var registrationToken = ' dbd-urTmTCA:APA91bGo7g85-Hu2iIK45QuvagBE-25KSbvt77_zf0ffRiADZld8Kz-p0HBPhAk8LIWy9K-dk7Lpv4wOqvCx3mYiN84cBZMg4wSOkIz8bu5nV0NbJCZo0zY5Qyh7q-Yu0q4YTpGjjw9P'

exports.notify = (message) => admin.messaging()
  .send(message)
  .then(console.log)
  .catch(console.error)
