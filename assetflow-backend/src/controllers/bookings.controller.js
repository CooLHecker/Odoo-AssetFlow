const pool = require("../config/db");

function toBookingDTO(row) {
  return {
    id: row.id,
    resourceType: row.resource_type,
    specificAsset: row.specific_asset,
    date: row.booking_date,
    startTime: row.start_time,
    endTime: row.end_time,
    purpose: row.purpose,
    bookedBy: row.booked_by,
    bookedByAvatar: row.booked_by_avatar || "",
    status: row.status,
  };
}

exports.listBookings = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bookings ORDER BY booking_date, start_time");
    res.json(rows.map(toBookingDTO));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/bookings/:id/status  { status: "Active" | "Pending" | "Completed" }
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Active", "Pending", "Completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const [result] = await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Booking not found" });
    res.json({ id: req.params.id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
