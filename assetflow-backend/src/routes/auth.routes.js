const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function buildUserProfile(email) {
  const normalizedEmail = normalizeEmail(email);
  const localPart = normalizedEmail.split("@")[0] || "assetflow.user";

  const displayName = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "AssetFlow User";

  let role = "Asset Manager";
  let department = "Operations";

  if (normalizedEmail === "admin@assetflow.com") {
    return {
      name: "Marcus Chen",
      email: normalizedEmail,
      role: "Fleet Manager",
      department: "IT Logistics",
      avatar: "https://ui-avatars.com/api/?name=Marcus+Chen&background=0f766e&color=ffffff"
    };
  }

  if (localPart.includes("auditor") || localPart.includes("compliance")) {
    role = "Compliance Auditor";
    department = "Governance & Risk";
  } else if (localPart.includes("admin") || localPart.includes("ops")) {
    role = "Operations Administrator";
    department = "Operations";
  } else if (localPart.includes("it") || localPart.includes("tech")) {
    role = "IT Asset Coordinator";
    department = "Information Technology";
  }

  const avatarName = encodeURIComponent(displayName || "AssetFlow User");

  return {
    name: displayName,
    email: normalizedEmail,
    role,
    department,
    avatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0f766e&color=ffffff`
  };
}

async function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function buildMailOptions(email, code) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  return {
    from,
    to: email,
    subject: "Your AssetFlow verification code",
    text: `Your AssetFlow verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <h2 style="margin: 0 0 12px; color: #0f766e;">AssetFlow sign-in verification</h2>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Use the verification code below to finish signing in to AssetFlow.</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; background: #ecfeff; color: #0f172a; padding: 16px 20px; border-radius: 12px; border: 1px solid #99f6e4; display: inline-block; margin-bottom: 16px;">
          ${code}
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 8px;">This code expires in 10 minutes.</p>
        <p style="font-size: 13px; line-height: 1.6; margin: 0; color: #475569;">If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
  };
}

router.post("/request-code", async (req, res) => {
  const email = normalizeEmail(req.body?.email);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  const existing = otpStore.get(email);
  if (existing && Date.now() - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    const retryAfterSeconds = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - existing.lastSentAt)) / 1000);
    return res.status(429).json({ error: `Please wait ${retryAfterSeconds}s before requesting another code.` });
  }

  const transporter = await createTransporter();
  if (!transporter) {
    return res.status(500).json({
      error: "Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in the backend environment.",
    });
  }

  const code = generateOtp();
  const verification = {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: Date.now(),
    token: crypto.randomUUID(),
  };

  await transporter.sendMail(buildMailOptions(email, code));
  otpStore.set(email, verification);

  return res.json({
    success: true,
    message: "Verification code sent.",
    expiresInMinutes: 10,
  });
});

router.post("/verify-code", (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const code = String(req.body?.code || "").trim();

  if (!email || !code) {
    return res.status(400).json({ error: "Email and verification code are required." });
  }

  const verification = otpStore.get(email);
  if (!verification) {
    return res.status(400).json({ error: "No active verification code found for this email." });
  }

  if (Date.now() > verification.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: "Verification code expired. Please request a new code." });
  }

  if (verification.code !== code) {
    verification.attempts += 1;
    if (verification.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(email);
      return res.status(429).json({ error: "Too many failed attempts. Please request a new code." });
    }

    otpStore.set(email, verification);
    return res.status(401).json({ error: "Incorrect verification code." });
  }

  otpStore.delete(email);

  return res.json({
    success: true,
    message: "Authentication successful.",
    user: buildUserProfile(email),
  });
});

module.exports = router;
