const router = require("express").Router();
const passport = require("passport") ;


router.post("/", passport.authenticate("local", {
        successRedirect: "/success",
        failureRedirect: "/error"
    })
);


module.exports = router ;

