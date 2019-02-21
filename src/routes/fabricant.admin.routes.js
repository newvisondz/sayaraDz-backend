const express = require("express");
const router = express.Router();
const controller = require("../controller/fabricant.admin.controller");
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.get("/", controller.index());

module.exports = router;