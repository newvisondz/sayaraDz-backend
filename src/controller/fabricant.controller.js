const User = require("../model/fabricant.model");
const passport = require("passport");
const JwtToken = require("../model/jwt.blacklist");
function index() {
    return [
        checkBlackList,
        (req, res, next)=> {
            passport.authenticate('jwt-fabricant', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.json({
                        error: 1,
                        msg : "invalid credentials"
                    });
                }
                res.json(user)

            })(req, res, next);
}

]
}

/*passport.authenticate("jwt-fabricant", {session: false}),
    (req, res) => {
        const user = req.user
            ? {id: req.user.id, isAdmin: req.user.isAdmin}
            : {error: "not authentified"} ;
        res.json(user);
    },*/


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

function logout(req, res) {

    const token = new JwtToken({token: req.headers.authorization});
    token.save()
        .then(()=>res.json({logout: true}))
        .catch(err=>{
            res.json({logout: false, msg: err.message})
        })
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

function checkBlackList(req, res, next){
    const token = req.headers.authorization ;
    JwtToken.findOne({token})
        .exec()
        .then((newToken)=>{
            console.log(newToken);
            if(newToken)
                res.json({error: true, msg: "you logout"});
            else next()
        })
        .catch(err=> {throw err})
}

module.exports = {signUp, login, index, logout};