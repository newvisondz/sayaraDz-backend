const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const auth = require("./src/config/auth") ;
const app = express();
const loginRouter = require("./src/routes");
const FileStore = require("session-file-store")(session);
app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(session({
    cookie: {expires: new Date(Date.now()+604800000)},
    secret: 'keyboard cat',
    store: new FileStore(),
}));

auth(app) ;

const PORT = process.env.PORT || 3000;

app.use("/login", loginRouter);

app.get("/success",(req, res)=>{
    console.log(req.user);
    res.json(req.user) ;
});


app.get("/error",(req, res)=>{
    res.json(req.isAuthenticated()) ;
});


app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log(`listening on port : ${PORT}`);
});