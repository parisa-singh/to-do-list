document.addEventListener("DOMContentLoaded", loadTasks);

const taskTitleInput = document.getElementById("taskTitleInput");
const taskDescriptionInput = document.getElementById("taskDescriptionInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const todoList = document.getElementById("todoList");
const inProgressList = document.getElementById("inProgressList");
const doneList = document.getElementById("doneList");

const deletedTasksList = document.getElementById("deletedTasksList");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    if (title === "") return;

    const task = { id: Date.now(), title, description, column: "todo" };
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    renderTasks();
}

function renderTasks() {
    clearColumns();
    const tasks = getTasks();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${task.title}</strong>`;
        li.draggable = true;

        li.addEventListener("click", () => alert(task.description));
        li.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", task.id));

        getColumn(task.column).appendChild(li);
    });

    renderDeletedTasks();
}

function renderDeletedTasks() {
    const deletedTasks = getDeletedTasks();
    deletedTasksList.innerHTML = "";

    deletedTasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title;

        li.addEventListener("click", () => restoreTask(task.id));
        deletedTasksList.appendChild(li);
    });
}

function deleteTask(taskId) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const deletedTasks = getDeletedTasks();
        deletedTasks.push(tasks.splice(taskIndex, 1)[0]);
        saveDeletedTasks(deletedTasks);
        saveTasks(tasks);
        renderTasks();
    }
}

function restoreTask(taskId) {
    const deletedTasks = getDeletedTasks();
    const taskIndex = deletedTasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const tasks = getTasks();
        tasks.push(deletedTasks.splice(taskIndex, 1)[0]);
        saveDeletedTasks(deletedTasks);
        saveTasks(tasks);
        renderTasks();
    }
}

function getColumn(column) {
    return column === "todo" ? todoList : column === "in-progress" ? inProgressList : doneList;
}

function clearColumns() {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDeletedTasks() {
    return JSON.parse(localStorage.getItem("deletedTasks")) || [];
}

function saveDeletedTasks(tasks) {
    localStorage.setItem("deletedTasks", JSON.stringify(tasks));
}

function loadTasks() {
    renderTasks();
}

document.querySelectorAll(".task-list").forEach(list => {
    list.addEventListener("dragover", (e) => e.preventDefault());
    list.addEventListener("drop", (e) => {
        const taskId = parseInt(e.dataTransfer.getData("text/plain"));
        moveTask(taskId, list.id.replace("List", "").toLowerCase());
    });
});

function moveTask(taskId, column) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].column = column;
        saveTasks(tasks);
        renderTasks();
    }
}
