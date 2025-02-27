/* Ensures tasks load on page refresh */
document.addEventListener("DOMContentLoaded", loadTasks);

/* Stores references to HTML elements */
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

/* Event Listeners */
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("input", toggleAddButton);
taskDate.addEventListener("input", toggleAddButton);
taskTime.addEventListener("input", toggleAddButton);
taskList.addEventListener("click", handleTaskClick);
clearAllBtn.addEventListener("click", clearAllTasks);

/* Enables/Disables Add button */
function toggleAddButton() {
    addTaskBtn.disabled = taskInput.value.trim() === "";
}

/* Adds a new task */
function addTask() {
    const taskText = taskInput.value.trim();
    const dueTime = taskTime.value || "--:--";
    let dueDate = taskDate.value || "-- -- ----";

    if (!taskText) {
        alert("Task cannot be empty!");
        return;
    }

    // Convert date to MM-DD-YYYY format if valid
    if (taskDate.value) {
        let dateObj = new Date(taskDate.value);
        let month = String(dateObj.getMonth() + 1).padStart(2, "0");
        let day = String(dateObj.getDate()).padStart(2, "0");
        let year = dateObj.getFullYear();
        dueDate = `${month}-${day}-${year}`;
    }

    const task = { text: taskText, id: Date.now(), completed: false, dueTime, dueDate };
    const tasks = getTasks();
    tasks.push(task);

    saveTasks(tasks);
    renderTasks();

    // Clear input fields
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    toggleAddButton();
}

/* Renders tasks */
/* Renders tasks */
function renderTasks() {
    taskList.innerHTML = "";
    const tasks = getTasks();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed-task' : ''}">${task.text}</span>
            <div class="task-buttons">
                <button class="complete">${task.completed ? "<<" : "☑"}</button>
                <button class="edit">✎</button>
                <button class="delete">⊘</button>
            </div>
            <span class="task-date"><strong>Due:</strong> ${task.dueTime} , ${task.dueDate}</span>
        `;

        taskList.appendChild(li);
    });
}


/* Handles task actions */
function handleTaskClick(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const taskId = Number(li.dataset.id);
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (event.target.classList.contains("delete")) {
        deleteTask(taskId);
    } else if (event.target.classList.contains("complete")) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        renderTasks();
    } else if (event.target.classList.contains("edit")) {
        editTask(taskId);
    }
}

/* Editing a task */
function editTask(taskId) {
    let tasks = getTasks();
    let taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) return;

    // Prompt user for new task text
    let newTaskText = prompt("Edit your task:", tasks[taskIndex].text);

    if (newTaskText !== null && newTaskText.trim() !== "") {
        tasks[taskIndex].text = newTaskText.trim();
        saveTasks(tasks);
        renderTasks();
    }
}

/* Deleting a task */
function deleteTask(taskId) {
    let tasks = getTasks().filter(task => task.id !== taskId);
    saveTasks(tasks);
    renderTasks();
}

/* Retrieves tasks from local storage */
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

/* Saves tasks to local storage */
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Loads tasks on page load */
function loadTasks() {
    renderTasks();
}

/* Clears all tasks */
function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem("tasks");
        renderTasks();
    }
}
