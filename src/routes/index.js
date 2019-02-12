const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy((username, passwd, done)=>{
    done(null, {id: 54, username, passwd})
}));


passport.serializeUser(function(user, done) {
    cb(null, {id:user.id});
});

passport.deserializeUser(function(id, cb) {
    return cb(null, {id: 5})
});

router.post('/',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/error.html' }));







module.exports = router;