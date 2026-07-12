const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/me", requireAuth, controller.me);

module.exports = router;
