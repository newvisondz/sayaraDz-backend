const Local = require("passport-local").Strategy;

const options = {
    usernameField: "email",
    passwordfield: "password"
};


module.exports = (Model)=>{

    function loginUser(email, password, done) {
        const user = {email};
        Model.findOne(user)
            .exec()
            .then(newUser => {
                newUser.isValidPasswd(
                    password,
                    validatePasswd(done, newUser)
                ) ;
            })
            .catch(err => {
                done(null, false);
            });
    }

    function validatePasswd(done, user){
        return (err, isValid)=>{
            if(err)return done(null, false);
            if(isValid) return done(null, user);
            done(null, false);
        }
    }
    return new Local(options, loginUser);

};