const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");

router.put("/mark-today/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const today = new Date().toISOString().split("T")[0]; // Get only YYYY-MM-DD

        const habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ success: false, error: "Habit not found" });

        // ✅ Check if today is already marked
        const alreadyMarked = habit.completedDates.some(date => date.toISOString().split("T")[0] === today);
        if (alreadyMarked) {
            return res.json({ success: false, message: "Already marked completed for today!" });
        }

        // ✅ Update Streak Logic
        let newStreak = habit.streak;
        if (habit.completedDates.length > 0) {
            const lastCompletedDate = new Date(habit.completedDates[habit.completedDates.length - 1]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastCompletedDate.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0]) {
                newStreak += 1; // Continue streak
            } else {
                newStreak = 1; // Reset streak
            }
        } else {
            newStreak = 1;
        }

        // ✅ Push today's date
        habit.completedDates.push(new Date());
        habit.streak = newStreak;

        // ✅ Update Status to "In Progress" if at least 1 day is completed
        if (habit.completedDates.length > 0) {
            habit.status = "In Progress";
        }

        await habit.save();

        res.json({ 
            success: true, 
            message: "Habit marked as completed for today!", 
            habit 
        });

    } catch (error) {
        console.error("🔥 Error marking habit completed:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHabit = await Habit.findByIdAndDelete(id);

        if (!deletedHabit) {
            return res.status(404).json({ success: false, error: "Habit not found" });
        }

        res.json({ success: true, message: "Habit deleted successfully!" });
    } catch (error) {
        console.error("🔥 Error deleting habit:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});



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


// ✅ Update Habit Status Route
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedHabit = await Habit.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedHabit) {
            return res.status(404).json({ success: false, error: "Habit not found" });
        }

        res.json({ success: true, message: "Habit status updated!", habit: updatedHabit });
    } catch (error) {
        console.error("🔥 Error updating habit:", error);
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
