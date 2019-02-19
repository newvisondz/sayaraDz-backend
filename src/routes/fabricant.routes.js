const express = require("express");
const passport = require("passport");
const router = express.Router();
const constroller = require("../controller/fabricant.controller");
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.get("/", constroller.index());
router.post("/login", constroller.login);
router.post("/signup", constroller.signUp);
router.get("/logout", constroller.logout)

module.exports = router;