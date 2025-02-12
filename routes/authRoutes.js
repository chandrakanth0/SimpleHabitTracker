const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await User.create({ name, email, password: hashedPassword });
        res.json({ success: true, message: "User registered!" });
    } catch (err) {
        res.json({ success: false, message: "Email already exists!" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

    res.json({ success: true, message: "Login successful", user: { name: user.name, email: user.email } });
});




module.exports = router;
