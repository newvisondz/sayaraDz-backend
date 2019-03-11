const express = require("express");
const router = express.Router();
const {login, logout} = require("../../services/auth");

router.post("/login", login("local-fabricant"));

router.delete("/logout", logout);

module.exports = router;