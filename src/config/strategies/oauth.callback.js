const Automobiliste = require("../../model/automobiliste.model");


function callback(accessToken, refreshToken, profile, done){

    Automobiliste.findOne({email: profile.emails[0].value})
        .exec()
        .then(autom => {
            console.log(autom, "autom");
            if (autom) {
                for (let a of autom.providers) {
                    if (a.name == "facebook") return done(null, autom)
                }
                autom.providers.push({
                    name: profile.provider,
                    id: profile.id
                });
                autom.save()
                    .then(newAutomate=>done(null, newAutomate))
                    .catch(err=> done(err));
            } else {
                const autom = new Automobiliste({
                    email: profile.emails[0].value,
                    providers: [
                        {
                            name: "facebook",
                            id: profile.id
                        }
                    ]
                });
                autom.save()
                    .then(newAutom => {
                        console.log(newAutom, "new autom");
                        done(null, newAutom);
                    })
                    .catch(err => done(err))
            }
        })
        .catch(err => done(err));

}

module.exports = callback ;