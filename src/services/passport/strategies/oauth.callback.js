const Automobiliste = require('../../../api/automobiliste/model')

module.exports = async (accessToken, refreshToken, profile, done) => {
  try {
    let autom = await Automobiliste.findOne({
      email: profile.emails[0].value
    })
    if (autom) {
      for (let a of autom.providers) {
        if (a.name === profile.provider) return done(null, autom)
      }
      autom.providers.push({
        name: profile.provider,
        id: profile.id
      })
      let newAutom = await autom.save()
      done(null, newAutom)
    } else {
      const autom = new Automobiliste({
        email: profile.emails[0].value,
        providers: [{
          name: profile.provider,
          id: profile.id
        }]
      })
      let newAutom = await autom.save()
      done(null, newAutom)
    }
  } catch (error) {
    done(error)
  }
}
