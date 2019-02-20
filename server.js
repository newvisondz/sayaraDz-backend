const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./src/config/passport.setup");
const app = express();
const userRouter = require("./src/routes/fabricant.routes");
const fabricantAdminRouter = require("./src/routes/fabricant.admin.routes");
const connect = require("./src/config/db-connection") ;
const passport = require("passport");
app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


auth(app);
const PORT = process.env.PORT || 3000;
app.use("/fabricant", userRouter);
app.use("/fabricant/admin", fabricantAdminRouter);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',(req, res, next)=>{
    passport.authenticate('facebook', function (err, user, info) {
        if (err) {
            return res.json(err);
        }
        res.json(user)

    })(req, res, next);
} );

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback',(req, res, next)=>{
    passport.authenticate('google', function (err, user, info) {
        if (err) {
            return res.json(err);
        }
        res.json(user)
    })(req, res, next);
} );



connect((err)=>{
    if(!err){
        app.listen(PORT, (err) => {
            if (err) throw err;
            console.log(`listening on port : ${PORT}`);
        });
    }
    else throw err;
});