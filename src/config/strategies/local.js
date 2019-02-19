const User = require("../../model/user");
const Local = require("passport-local").Strategy;
const options = {
    usernameField: "username",
    passwordfield: "password"
};
const local = new Local(options, loginUser);

function loginUser(username, password, done) {
    const user = {username};
    User.findOne(user)
        .exec()
        .then(newUser => {
            const {createdOn, id, email} = newUser;

            newUser.isValidPasswd(
                password,
                validatePasswd(done, newUser)
            ) ;
        })
        .catch(err => {
            done(null, false, {message:  "server issue"});
        });
}

function validatePasswd(done, user){
    return (err, isValid)=>{
        if(err)return done(null, false, {message: "server issue"});
        if(isValid) return done(null, user);
        done(null, false, {message: "not valid passwd"});
    }
}

module.exports = local;