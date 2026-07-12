const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookings.controller");

router.get("/", controller.listBookings);
router.patch("/:id/status", controller.updateBookingStatus);

module.exports = router;
