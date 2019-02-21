const express = require("express");
const router = express.Router();
const controller = require("../controller/fabricant.controller");
const authController = require("../controller/auth.controller");
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.get("/", controller.index());

router.post("/login", authController.login("fabricant"));

router.delete("/logout", authController.logout);

router.get("/current", controller.current());

module.exports = router;