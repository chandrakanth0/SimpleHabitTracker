
// ✅ Check if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "index.html";
} else {
    document.getElementById("username").innerText = user.name;
}

// ✅ Fetch Habits from MongoDB
async function fetchHabits() {
    try {
        const response = await fetch(`http://localhost:3000/api/habits/all/${user.email}`);
        const data = await response.json();

        if (data.success) {
            displayHabits(data.habits);
        } else {
            document.getElementById("taskList").innerHTML = "<p>Error loading habits.</p>";
        }
    } catch (error) {
        console.error("🔥 Error fetching habits:", error);
        document.getElementById("taskList").innerHTML = "<p>Server error. Try again later.</p>";
    }
}

function displayHabits(habits) {
const taskList = document.getElementById("taskList");
taskList.innerHTML = "";

if (habits.length === 0) {
taskList.innerHTML = "<p>No habits added yet.</p>";
return;
}

habits.forEach((habit) => {
const remainingDays = Math.max(0, Math.ceil((new Date(habit.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

const li = document.createElement("li");
li.classList.add("task");
li.innerHTML = `
    <div>
        <strong>${habit.name}</strong> - ${habit.category} <br>
        📅 Start: ${new Date(habit.startDate).toDateString()} | 
        ⏳ End: ${new Date(habit.endDate).toDateString()} |
        ✅ Status: <span id="status-${habit._id}">${habit.status}</span> <br>
        🔥 Streak: <span id="streak-${habit._id}">${habit.streak}</span> days |
        ⏳ Remaining: ${remainingDays} days
    </div>
    <button style="color:white;background:green;margin-left:15px;border-radius:25px" onclick="markToday('${habit._id}')">Mark Completed for Today</button>
    <button style="color:white;background:red;margin:20px;border-radius:25px" onclick="deleteHabit('${habit._id}')" class="delete-btn">Delete</button>
`;
taskList.appendChild(li);
});
}




// ✅ Logout Function
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// ✅ Fetch habits on page load
fetchHabits();


async function markCompleted(habitId) {
try {
const response = await fetch(`http://localhost:3000/api/habits/update/${habitId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Completed" })
});

const result = await response.json();
if (result.success) {
    document.getElementById(`status-${habitId}`).innerText = "Completed";
    fetchHabits(); // Refresh list
} else {
    alert("Failed to update habit.");
}
} catch (error) {
console.error("🔥 Error updating habit:", error);
}
}

async function markToday(habitId) {
try {
const response = await fetch(`http://localhost:3000/api/habits/mark-today/${habitId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
});

const result = await response.json();
if (result.success) {
    document.getElementById(`streak-${habitId}`).innerText = result.habit.streak;
    fetchHabits(); // Refresh UI
} else {
    alert(result.message);
}
} catch (error) {
console.error("🔥 Error updating habit for today:", error);
}
}

async function deleteHabit(habitId) {
if (!confirm("Are you sure you want to delete this habit?")) return;

try {
const response = await fetch(`/api/habits/delete/${habitId}`, {
    method: "DELETE",
});

const result = await response.json();
if (result.success) {
    alert("Habit deleted successfully!");
    fetchHabits(); // Refresh the habit list
} else {
    alert("Failed to delete habit.");
}
} catch (error) {
console.error("🔥 Error deleting habit:", error);
alert("Server error, please try again later.");
}
}

