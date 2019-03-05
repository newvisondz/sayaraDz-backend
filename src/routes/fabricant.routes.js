const express = require("express");
const router = express.Router();
const controller = require("../controller/fabricant.controller");

router.get("/", controller.index());
router.post("/", controller.create());
router.delete("/:id", controller.deleteOne());
module.exports = router;