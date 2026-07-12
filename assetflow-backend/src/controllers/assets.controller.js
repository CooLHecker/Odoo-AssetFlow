const pool = require("../config/db");

// Maps a DB row (snake_case) to the shape the frontend's Asset type expects (camelCase)
function toAssetDTO(row) {
  return {
    tag: row.tag,
    name: row.name,
    category: row.category,
    department: row.department,
    status: row.status,
    assignedTo: row.assigned_to,
    assignedToTitle: row.assigned_to_title,
    condition: row.asset_condition,
    location: row.location,
    purchaseDate: row.purchase_date,
    purchaseValue: Number(row.purchase_value) || 0,
    warrantyTill: row.warranty_till,
    serialNumber: row.serial_number,
    manufacturer: row.manufacturer,
    specs: row.specs,
    history: row.history || [],
  };
}

exports.listAssets = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM assets ORDER BY created_at DESC");
    res.json(rows.map(toAssetDTO));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAsset = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM assets WHERE tag = ?", [req.params.tag]);
    if (rows.length === 0) return res.status(404).json({ error: "Asset not found" });
    res.json(toAssetDTO(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
