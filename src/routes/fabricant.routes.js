const express = require("express");
const router = express.Router();
const controller = require("../controller/fabricant.controller");
const authController = require("../controller/auth.controller");


router.get("/", controller.index());

router.post("/login", authController.login("local-fabricant"));

router.delete("/logout", authController.logout);

router.get("/current", controller.current());

module.exports = router;