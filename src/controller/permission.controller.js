const passport = require("passport");
const JwtToken = require("../model/jwt.blacklist");


const checkFabricantAdminAuth = (req, res, next) => passport.authenticate(
    'jwt-fabricant',
    (err, user, info) => {
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

const checkToken = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        newToken = JwtToken.findOne({
            token
        })
        if (newToken)
            res.json({
                error: true,
                msg: "successful logout"
            });
        else next()
    } catch (error) {
        next(error)
    }
}

const checkAuth = (strategy, msg) =>
    (req, res, next) => passport.authenticate(strategy, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                error: true,
                msg
            });
        }
        req.user = user;
        next()
    })(req, res, next);


exports.generateToken = (req, res, next) => {
    req.user.token = req.user.sign();
    next();
}
exports.isFabricant = [
    checkToken, checkAuth('jwt-fabricant', "permission denied")
];

exports.isAdmin = [
    checkToken, checkAuth('jwt-admin', "permission denied")
];

exports.isFabricantAdmin = [
    checkToken, checkFabricantAdminAuth
];

exports.checkAuth = checkAuth