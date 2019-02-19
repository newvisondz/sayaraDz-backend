const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const auth = require("./src/config/auth");
const app = express();
const userRouter = require("./src/routes/fabricant.routes");
const connect = require("./src/config/db-connection") ;
app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

auth(app);
const PORT = process.env.PORT || 3000;
app.use("/fabricant", userRouter);


connect((err)=>{
    if(!err){
        app.listen(PORT, (err) => {
            if (err) throw err;
            console.log(`listening on port : ${PORT}`);
        });
    }
    else throw err;
});