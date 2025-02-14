
document.getElementById("habitForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const habitData = {
        userId: user.email,  // Associate habit with user
        name: document.getElementById("habitName").value.trim(),
        category: document.getElementById("habitCategory").value.trim(),
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        priority: document.getElementById("priority").value,
        goalDescription: document.getElementById("goalDescription").value.trim(),
        status: document.getElementById("status").value,
        streak: 0,  // ✅ Initialize streak
        completedDates: [] 
        
    };

    const response = await fetch("http://localhost:3000/api/habits/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habitData)
    });

    const result = await response.json();
    const message = document.getElementById("message");

    if (result.success) {
        message.style.color = "green";
        message.innerText = "Habit added successfully!";
        setTimeout(() => window.location.href = "dashboard.html", 1000);
    } else {
        message.style.color = "red";
        message.innerText = result.error || "Failed to add habit.";
    }
});
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
