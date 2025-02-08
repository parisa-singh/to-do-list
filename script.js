document.addEventListener("DOMContentLoaded", loadTasks); /*ensures that the function loadTasks() runs once the page has fully loaded*/

/*store references to HTML elements*/
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);

/*adding a new task*/
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, id: Date.now() };
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    taskInput.value = "";
    renderTasks();
}

/*rendering tasks*/
function renderTasks() {
    taskList.innerHTML = "";
    const tasks = getTasks();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="edit" onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

/*deleting a task*/
function deleteTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    renderTasks();
}

/*editing a task*/
function editTask(taskId) {
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const newTaskText = prompt("Edit your task:", tasks[taskIndex].text);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        tasks[taskIndex].text = newTaskText.trim();
        saveTasks(tasks);
        renderTasks();
    }
}

/*retrieving tasks from local storage*/
function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

/*saving tasks from local storage*/
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/*loading tasks on page load*/
function loadTasks() {
    renderTasks();
}
