import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";

const router = express.Router();


// 🧩 Admin Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    // Verify secret code
    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ message: "Invalid secret code ❌" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({ name, email, password: hashedPassword ,secretCode});
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully ✅", admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔑 Admin Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password ❌" });

    res.json({ message: "Admin login successful ✅", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
