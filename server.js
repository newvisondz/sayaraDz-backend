const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./src/config/passport.setup");
const app = express();

//routers
const userRouter = require("./src/routes/fabricant.user.routes");
const fabricantAdminRouter = require("./src/routes/fabricant.admin.routes");
const oauthRouter = require("./src/routes/oauth.routes");
const adminRouter = require("./src/routes/admin.routes");
const fabricantRouter = require("./src/routes/fabricant.routes");
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



 require("./src/model/fabricant.user.model").Model
