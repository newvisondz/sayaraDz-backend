const User = require("../model/user");
const passport = require("passport");

function index(req, res){
    res.json(req.user || {error: "not authentified"})
}

function login() {
    return [

        passport.authenticate("local", {
            // successRedirect: "/user",
            // failureRedirect: "/error",
            session: false
        }),
        (req, res, next)=>{res.json(req.user)},
    ]
}

function signUp(req, res, next){

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
            if(err.code === 11000){
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