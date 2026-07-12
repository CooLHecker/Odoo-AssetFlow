const express = require("express");
const router = express.Router();
const controller = require("../controllers/notifications.controller");

router.get("/", controller.listNotifications);
router.delete("/:id", controller.dismissNotification);

module.exports = router;
