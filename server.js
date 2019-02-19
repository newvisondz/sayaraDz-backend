const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const auth = require("./src/config/auth");
const app = express();
const userRouter = require("./src/routes/user-routes");
require("./src/config/db-connection")() ;
app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

/*app.use(session({
    cookie: { expires: new Date(Date.now() + 604800000) },
    secret: 'keyboard cat',
    // store: new FileStore(),
    resave: true,
}));*/

auth(app);
const PORT = process.env.PORT || 3000;
app.use("/user", userRouter);

app.get("/er\n" +
    "\n" +
    "\nror", (req, res) => {
    res.json({error: "error message"});
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`listening on port : ${PORT}`);
});
