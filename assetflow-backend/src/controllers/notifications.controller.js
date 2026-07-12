const pool = require("../config/db");

function toNotificationDTO(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    timeText: row.time_text,
    group: row.notif_group,
    unread: !!row.unread,
    assetTag: row.asset_tag || undefined,
    actionable: !!row.actionable,
  };
}

exports.listNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.json(rows.map(toNotificationDTO));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dismissNotification = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM notifications WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Notification not found" });
    res.json({ id: req.params.id, deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
