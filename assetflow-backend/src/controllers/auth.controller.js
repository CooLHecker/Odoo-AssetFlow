const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = "7d";

function toUserDTO(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    status: row.status,
  };
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

// POST /api/auth/signup  { name, email, password, department? }
// Always creates an EMPLOYEE account. No role can be supplied by the client —
// promotion to Department Head / Asset Manager only happens later, from the
// Employee Directory (Admin only).
exports.signup = async (req, res) => {
  const { name, email, password, department } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role, department, status) VALUES (?, ?, ?, 'EMPLOYEE', ?, 'Active')",
      [name, normalizedEmail, passwordHash, department || null]
    );

    const user = toUserDTO({
      id: result.insertId,
      name,
      email: normalizedEmail,
      role: "EMPLOYEE",
      department: department || null,
      status: "Active",
    });

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login  { email, password }
exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const row = rows[0];
    if (row.status !== "Active") {
      return res.status(403).json({ error: "This account has been deactivated" });
    }

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = toUserDTO(row);
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me  (requires Authorization: Bearer <token>)
// Re-reads from the DB (not just the token) so a role change or
// deactivation takes effect without waiting for the token to expire.
exports.me = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });
    if (rows[0].status !== "Active") {
      return res.status(403).json({ error: "This account has been deactivated" });
    }
    res.json(toUserDTO(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
