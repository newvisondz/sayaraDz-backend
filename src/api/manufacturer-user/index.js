const express = require("express");
const router = express.Router();
const authController = require("../../services/auth");

router.post("/login", authController.login("local-fabricant"));

router.delete("/logout", authController.logout);

module.exports = router;