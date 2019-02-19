const express = require("express");
const router = express.Router();
const controller = require("../controller/fabricant.controller");
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.get("/", controller.index());

router.post("/login", controller.login());

router.delete("/logout", controller.logout);

router.get("/current", controller.current());

//router.post("/signup", constroller.signUp);



module.exports = router;