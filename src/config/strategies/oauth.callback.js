const Automobiliste = require("../../model/automobiliste.model");

module.exports = async (accessToken, refreshToken, profile, done) => {
    try {
        autom = await Automobiliste.findOne({
            email: profile.emails[0].value
        })
        if (autom) {
            for (let a of autom.providers) {
                if (a.name == "facebook") return done(null, autom)
            }
            autom.providers.push({
                name: profile.provider,
                id: profile.id
            });
            let newAutom = await autom.save()
            done(null, newAutom)
        } else {
            const autom = new Automobiliste({
                email: profile.emails[0].value,
                providers: [{
                    name: "facebook",
                    id: profile.id
                }]
            });
            let newAutom = await autom.save()
            done(null, newAutom);
        }
    } catch (error) {
        done(error)
    }
}