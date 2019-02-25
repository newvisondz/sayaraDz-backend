const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./src/config/passport.setup");
const app = express();
const connect = require("./src/config/db-connection") ;
const passport = require("passport");
const Admin = require("./src/model/admin.model");
//routers
const userRouter = require("./src/routes/fabricant.routes");
const fabricantAdminRouter = require("./src/routes/fabricant.admin.routes");
const oauthRouter = require("./src/routes/oauth.routes");
const adminRouter = require("./src/routes/admin.routes");
const fabricantRouter = require("./src/routes/fabricant.m.routes");

const cors = require("cors");

app.use(cors());

app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


auth(app);
const PORT = process.env.PORT || 3000;

//define principle routes
app.use("/fabricant", userRouter);
app.use("/fabricant/admin", fabricantAdminRouter);
app.use("/auth", oauthRouter);
app.use("/admin", adminRouter);
app.use("/fabricant/model", fabricantRouter) ;

connect((err)=>{

    if(!err){
        app.listen(PORT, (err) => {
            if (err) throw err;
            console.log(`listening on port : ${PORT}`);
        });
    }
    else throw err;
});

require("./src/model/automobiliste.model");
