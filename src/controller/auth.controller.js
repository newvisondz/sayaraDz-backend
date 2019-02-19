const passport = require("passport");
const JwtToken = require("../model/jwt.blacklist");

function checkBlackList(req, res, next) {
    const token = req.headers.authorization;
    JwtToken.findOne({token})
        .exec()
        .then((newToken) => {
            if (newToken)
                res.json({error: true, msg: "you logout"});
            else next()
        })
        .catch(err => {
            throw err
        })
}

function jwtFabricantAuth(req, res, next) {
    passport.authenticate('jwt-fabricant', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                error: true,
                msg: "permission denied"
            });
        }
        res.json(user)

    })(req, res, next);
}

module.exports = {checkBlackList, jwtFabricantAuth} ;