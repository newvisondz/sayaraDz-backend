const express = require("express");
const router = express.Router();
const controller = require("../controller/admin.controller");
const authController = require("../controller/auth.controller");


router.get("/", controller.index());

router.post("/login", authController.login("local-admin"));

router.delete("/logout", authController.logout);

router.get("/current", controller.current());

module.exports = router;