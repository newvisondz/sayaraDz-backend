const express = require("express");
const router = express.Router()
const passport = require("passport");


router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',(req, res, next)=>{
    passport.authenticate('facebook', function (err, user, info) {
        if (err) {
            return res.json(err);
        }
        res.json(user)

    })(req, res, next);
} );

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',(req, res, next)=>{
    passport.authenticate('google', function (err, user, info) {
        if (err) {
            return res.json(err);
        }
        res.json(user)
    })(req, res, next);
} );

module.exports = router ;