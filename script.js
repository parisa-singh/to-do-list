/* Ensures that the function loadTasks() runs once the page has fully loaded */
document.addEventListener("DOMContentLoaded", loadTasks);

/* Stores references to HTML elements */
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("input", toggleAddButton);
taskDate.addEventListener("input", toggleAddButton);
taskList.addEventListener("click", handleTaskClick);
clearAllBtn.addEventListener("click", clearAllTasks);

/* Adds an event listener for pressing the Enter key */
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

/* Enables/Disables the Add button */
function toggleAddButton() {
    addTaskBtn.disabled = taskInput.value.trim() === "";
}

/* Adding a new task */
function addTask() {
    const taskText = taskInput.value.trim();
    const dueTime = taskTime.value || "-- : --";
    let dueDate = taskDate.value || "-- -- ----";

    if (!taskText) return; // Prevent adding empty tasks

    // Convert the date to MM-DD-YYYY format if valid
    if (taskDate.value) {
        let dateObj = new Date(taskDate.value);
        let month = String(dateObj.getMonth() + 1).padStart(2, "0");
        let day = String(dateObj.getDate()).padStart(2, "0");
        let year = dateObj.getFullYear();
        dueDate = `${month}-${day}-${year}`;
    }

    const task = { 
        text: taskText, 
        id: Date.now(), 
        completed: false,
        dueTime: dueTime,
        dueDate: dueDate
    };

    const tasks = getTasks();
    tasks.push(task);
    
    // Sorting: Tasks with no due date stay at the bottom
    tasks.sort((a, b) => {
        if (a.dueDate === "-- -- ----") return 1;
        if (b.dueDate === "-- -- ----") return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    saveTasks(tasks);

    // Clear input fields
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    toggleAddButton();
    renderTasks();
}

/* Rendering tasks */
function renderTasks() {
    taskList.innerHTML = "";
    const tasks = getTasks();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;
        li.classList.toggle("completed", task.completed);

        li.innerHTML = `
            <div class="task-info">
                <span>${task.text}</span>
                <div>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
            <span class="task-date"><strong>Due:</strong> ${task.dueTime} , ${task.dueDate}</span>
        `;

        taskList.appendChild(li);
    });
}

/* Handling task clicks (Edit, Delete, Toggle Complete) */
function handleTaskClick(event) {
    const li = event.target.closest("li");
    if (!li) return;

    const taskId = Number(li.dataset.id);
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (event.target.classList.contains("delete")) {
        deleteTask(taskId);
    } else if (event.target.classList.contains("edit")) {
        editTask(taskId);
    } else if (event.target.classList.contains("save")) {
        saveEditedTask(taskId, li.querySelector(".edit-input"), event.target);
    } else {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        renderTasks();
    }
}

/* Editing a task */
function editTask(taskId) {
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const li = document.querySelector(`li[data-id="${taskId}"]`);
    const taskTextSpan = li.querySelector("span"); 
    const editButton = li.querySelector(".edit"); 

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = tasks[taskIndex].text;
    inputField.classList.add("edit-input");

    taskTextSpan.replaceWith(inputField);
    inputField.focus();

    // Changes the edit button text to "Save"
    editButton.textContent = "Save";
    editButton.classList.add("save");

    inputField.addEventListener("blur", () => saveEditedTask(taskId, inputField, editButton));

    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveEditedTask(taskId, inputField, editButton);
        }
    });
}

/* Saving an edited task */
function saveEditedTask(taskId, inputField, editButton) {
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const newText = inputField.value.trim();
    if (newText !== "") {
        tasks[taskIndex].text = newText;
        saveTasks(tasks);
    }
    renderTasks();
}

/* Deleting a task */
function deleteTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    renderTasks();
}

/* Retrieving tasks from local storage */
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

/* Saving tasks to local storage */
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Loading tasks on page load */
function loadTasks() {
    renderTasks();
}

/* Clearing all tasks */
function clearAllTasks() {
    localStorage.removeItem("tasks");
    renderTasks();
}
