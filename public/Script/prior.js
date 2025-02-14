
// ✅ Check if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "index.html";
}

// ✅ Fetch Priority-wise Habits
async function fetchPriorityHabits() {
    try {
        const response = await fetch(`http://localhost:3000/api/habits/priority/${user.email}`);
        const data = await response.json();

        if (data.success) {
            displayPriorityHabits(data.habits);
        } else {
            document.getElementById("priorityList").innerHTML = "<tr><td colspan='5'>No habits found.</td></tr>";
        }
    } catch (error) {
        console.error("Error fetching habits:", error);
    }
}

// ✅ Display habits in priority order
function displayPriorityHabits(habits) {
    const priorityList = document.getElementById("priorityList");
    priorityList.innerHTML = "";

    habits.forEach(habit => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${habit.priority}</td>
            <td>${habit.name}</td>
            <td>${habit.category}</td>
            <td>${habit.goalDescription}</td>
            <td>${habit.status}</td>
        `;
        priorityList.appendChild(row);
    });
}

// ✅ Logout Function
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// ✅ Load habits on page load
fetchPriorityHabits();
