const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./src/services/passport");
const app = express();

//routers
const userRouter = require("./src/api/manufacturer-user");
const fabricantAdminRouter = require("./src/api/manufacturer-admin");
const oauthRouter = require("./src/api/auth");
const adminRouter = require("./src/api/admin");
const fabricantRouter = require("./src/api/manufacturer");
const cors = require("cors");

app.use(cors());
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

auth(app);

//define principle routes
app.use("/fabricant/user", userRouter);
app.use("/fabricant/admin", fabricantAdminRouter);
app.use("/auth", oauthRouter);
app.use("/admin", adminRouter);
app.use("/fabricant", fabricantRouter);

exports.connect = (PORT) =>
    app.listen(PORT, (err) => {
        if (err) throw err;
        console.log({
            listening: true,
            PORT
        })
        console.log({
            mode: process.env.NODE_ENV || "development"
        })
    })



    