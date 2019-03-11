const express = require("express");
const router = express.Router();
const controller = require("./controller");
const authController = require("../../services/auth");


router.get("/", controller.index());

router.post("/login", authController.login("local-admin"));

router.delete("/logout", authController.logout);

router.get("/current", controller.current());

module.exports = router;