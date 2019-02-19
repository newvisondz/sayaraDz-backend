const express = require("express");
const passport = require("passport");
const router = express.Router();
const {signUp, login, index} = require("../controller/fabricant.controller");
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.get("/", index());
router.post("/login", login);
router.post("/signup", signUp);

module.exports = router;