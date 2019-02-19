const User = require("../model/fabricant.model");
const passport = require("passport");

function index() {
    return [
        passport.authenticate("jwt-fabricant", {session: false}),
        (req, res) => res.json(req.user || {error: "not authentified"}),
    ]
}

function login(req, res, next) {
    passport.authenticate('fabricant', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                error: 1,
                msg : "invalid username/password"
            });
        }
        res.json(user)
    })(req, res, next);
}

function signUp(req, res, next) {

    let user = {password, email, firstName, lastName, address, phone} = req.body;
    user = new User(user);
    user.save()
        .then((newUser) => {
            req.login(newUser, function (err) {
                if (err) {
                    return next(err);
                }
                res.json(newUser);
            });
        })
        .catch((err) => {
            if (err.code === 11000) {
                const error = {
                    error: true,
                    message: "username exists"
                };
                return res.json(error)
            }
            res.json(err);
        })
}



module.exports = {signUp, login, index};