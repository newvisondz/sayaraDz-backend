const express = require("express")
const session = require("express-session")
const FileStore = require('session-file-store')(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
let app = express()

app.use(express.static("static"))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

let count = 1 ;
passport.use(new LocalStrategy(
    function(username, password, done) {
            console.log("authenticating ...");
        return done(null, {username, password, id:count++})
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    done(null, {name: user +" id"});
});

app.post('/login',
    (req, res, next)=>{
        res.cookie("id", count)
        passport.authenticate('local', { successRedirect: '/h',
            failureRedirect: '/error.html', session: !false})(req, res, next)
    }
);

app.all("/h",(req, res)=>{
    res.json({
        user: req.user,
        auth: req.isAuthenticated()
    })
});

const PORT = process.env.PORT || 3000 ;

app.listen(PORT, (err) => {
    if (err) console.log(err.message)
    else console.log(`listening on ${PORT}`)
});