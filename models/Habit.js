const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    userId: { type: String , required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: Number, required: true, min: 1, max: 10 },
    goalDescription: { type: String, required: true },
    status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" }
});

module.exports = mongoose.model("Habit", HabitSchema);
