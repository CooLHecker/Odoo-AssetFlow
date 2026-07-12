const express = require("express");
const router = express.Router();
const controller = require("../controllers/assets.controller");

router.get("/", controller.listAssets);
router.get("/:tag", controller.getAsset);

module.exports = router;
