const Automobiliste = require('../../api/automobiliste/model')

module.exports = async (accessToken, refreshToken, profile, done) => {
  try {
    let autom = await Automobiliste.findOne({
      uid: profile.uid
    })
    if (autom) {
      for (let a of autom.providers) {
        if (a.name === profile.firebase.identities.sign_in_provider) return done(null, autom)
      }
      autom.providers.push({
        name: profile.firebase.identities.sign_in_provider
      })
      let newAutom = await autom.save()
      done(null, newAutom)
    } else {
      const autom = new Automobiliste({
        email: profile.email,
        uid: profile.uid,
        providers: [{
          name: profile.firebase.identities.sign_in_provider
        }]
      })
      let newAutom = await autom.save()
      done(null, newAutom)
    }
  } catch (error) {
    done(error)
  }
}

// {
//   "name": "Yacine Benkaidali",
//   "picture": "https://graph.facebook.com/967106496960889/picture",
//   "iss": "https://securetoken.google.com/sayaradz-9d20c",
//   "aud": "sayaradz-9d20c",
//   "auth_time": 1566210064,
//   "user_id": "YM3sR0TvNgTGqCm4OpG69gKC3W82",
//   "sub": "YM3sR0TvNgTGqCm4OpG69gKC3W82",
//   "iat": 1566211367,
//   "exp": 1566214967,
//   "email": "yacinebenkaidali@gmail.com",
//   "email_verified": false,
//   "firebase": {
//   "identities": {
//   "facebook.com": [
//   "967106496960889"
//   ],
//   "email": [
//    "yacinebenkaidali@gmail.com"
//   ]
//   },
//   "sign_in_provider": "facebook.com"
//   },
//   "uid": "YM3sR0TvNgTGqCm4OpG69gKC3W82"
//   }
