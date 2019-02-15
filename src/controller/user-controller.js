const User = require("../model/user");
const passport = require("passport");

const signUp = (req, res, next) => {

    let user = {username, password, email} = req.body;
    // console.log(req.body.username);
    user = new User(user);
    user.save()
        .then((newUser) => {
            req.login(newUser, function (err) {
                if (err) {
                    return next(err);
                }
                let u = {username: newUser.username, password: newUser.password, id: newUser.id};
                res.json(u);
            });
        })
        .catch((err) => {
            res.json({message} = err);
            next(err);
        })
};

function login() {
    return passport.authenticate("local", {
        successRedirect: "/success",
        failureRedirect: "/error"
    })
}

function index(req, res){
    res.json( {isaut: req.isAuthenticated(), error: "not logged in"})
}

module.exports = {signUp, login, index};