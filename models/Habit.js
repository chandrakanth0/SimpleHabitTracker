const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    userId: String,
    name: String,
    category: String,
    startDate: Date,
    endDate: Date,
    priority: Number,
    goalDescription: String,
    status: String,
    streak: { type: Number, default: 0 }, // ✅ Track streak
    completedDates: { type: [Date], default: [] }, // ✅ Track completed days
});

module.exports = mongoose.model("Habit", HabitSchema);
