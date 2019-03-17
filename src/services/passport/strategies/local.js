const Local = require('passport-local').Strategy

const options = {
  usernameField: 'email',
  passwordfield: 'password'
}

module.exports = (Model) => {
  let validatePasswd = (done, user) => {
    return (err, isValid) => {
      console.log({ isValid })
      if (err) return done(null, false)
      if (isValid) return done(null, user)
      done(null, false)
    }
  }
  let loginUser = async (email, password, done) => {
    let user = {
      email
    }
    try {
      let newUser = await Model.findOne(user)
      newUser.isValidPasswd(
        password,
        validatePasswd(done, newUser)
      )
    } catch (err) {
      done(null, false)
    }
  }

  return new Local(options, loginUser)
}
