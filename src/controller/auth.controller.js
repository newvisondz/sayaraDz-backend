const passport = require("passport");
const JwtToken = require("../model/jwt.blacklist");

function checkToken(req, res, next) {
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

function checkFabricantAuth(strategy, msg) {
    return (req, res, next)=>{
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({error: true, msg});
            }
            req.user = user;
            next()
        })(req, res, next);
    }
}


function checkFabricantAdminAuth(req, res, next) {
    passport.authenticate('jwt-fabricant', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user || !user.isAdmin) {
            return res.json({
                error: true,
                msg: "permission denied"
            });
        }
        req.user = user;
        next()

    })(req, res, next);
}

const isFabricant = [
    checkToken, checkFabricantAuth('jwt-fabricant', "permission denied")
];


const isFabricantAdmin = [
    checkToken, checkFabricantAdminAuth
];


module.exports = {
    checkFabricantAuth,
    isFabricant,
    isFabricantAdmin
};