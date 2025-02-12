const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");


router.get("/priority/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const habits = await Habit.find({ userId }).sort({ priority: -1 }); // Sorting by priority (Highest first)

        res.json({ success: true, habits });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});


router.get("/all/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const habits = await Habit.find({ userId }); // Ensure userId matches schema
        res.json({ success: true, habits });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});


// ✅ Add Habit Route
router.post("/add", async (req, res) => {
    try {
        const { userId, name, category, startDate, endDate,priority,goalDescription, status } = req.body;

        if (!userId || !name || !category || !startDate || !endDate || !priority || !goalDescription || !status) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const newHabit = new Habit({ userId, name, category, startDate, endDate,priority,goalDescription, status });
        await newHabit.save();
        
        res.json({ success: true, message: "Habit added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
