
// ✅ Get User Info
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "index.html";
}

// ✅ Fetch Habit Status from the Database
async function fetchHabitStatus() {
    try {
        const response = await fetch(`http://localhost:3000/api/habits/all/${user.email}`);
        const data = await response.json();

        if (data.success) {
            displayHabitStatus(data.habits);
        } else {
            console.error("Error fetching habits:", data.error);
        }
    } catch (error) {
        console.error("Server error:", error);
    }
}

// ✅ Display Habit Status
function displayHabitStatus(habits) {
    const statusList = document.getElementById("statusList");
    statusList.innerHTML = "";

    if (habits.length === 0) {
        statusList.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No habits added yet.</td></tr>";
        return;
    }

    habits.forEach(habit => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${habit.name}</td>
            <td>${habit.category}</td>
            <td>${habit.startDate.split("T")[0]}</td>
            <td>${habit.endDate.split("T")[0]}</td>
            <td class="status ${getStatusClass(habit.status)}">${habit.status}</td>
        `;
        statusList.appendChild(row);
    });
}

// ✅ Get CSS Class for Status
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case "not started": return "not-started";
        case "in progress": return "in-progress";
        case "completed": return "completed";
        default: return "";
    }
}

// ✅ Logout Function
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// ✅ Fetch and Display Habit Status on Page Load
fetchHabitStatus();
