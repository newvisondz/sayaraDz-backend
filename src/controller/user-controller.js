const User = require("../model/user");
const passport = require("passport");

function index() {
    return [
        passport.authenticate("jwt", {session: false}),
        (req, res) => res.json(req.user || {error: "not authentified"}),
    ]
}

function login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        res.json(user)
    })(req, res, next);
}

function signUp(req, res, next) {

    let user = {username, password, email} = req.body;
    user = new User(user);
    user.save()
        .then((newUser) => {
            req.login(newUser, function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect("/user");
            });
        })
        .catch((err) => {
            if (err.code === 11000) {
                const error = {
                    error: true,
                    message: "The user exists"
                };
                return res.json(error)
            }
            res.json(err);
        })
}



module.exports = {signUp, login, index};