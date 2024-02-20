let currentDraggedElement;
let matchingBoardTask = [];
let boardTasks = [];

async function loadTasksInBoard() {
    try {
      boardTasks = JSON.parse(await getItem("boardTasks"));
    } catch (error) {
      console.log(error)
    }  
}


async function boardInit() {
    await loadTasksInBoard();
    renderEachTask();
}

function renderEachTask() {
    clearHTML();
    for (let i = 0; i < boardTasks.length; i++) {
        const task = boardTasks[i];
        let containerId = "";
        checkCategory(task, containerId);
        updateProgressBar(task);
        noTodoMessage();
    }
}

function renderMatchingTask() {
    clearHTML();
    for (let i = 0; i < matchingBoardTask.length; i++) {
        const task = matchingBoardTask[i];
        let containerId = "";
        checkCategory(task, containerId);
        updateProgressBar(task);
        noTodoMessage();
    }
}

function checkCategory(task, containerId) {
    if (task.category === "toDo") {
        containerId = "toDo";
    } else if (task.category === "inProgress") {
        containerId = "inProgress";
    } else if (task.category === "awaitFeedback") {
        containerId = "awaitFeedback";
    } else if (task.category === "done") {
        containerId = "done";
    }
    createHTML(task, containerId);
}

function clearHTML() {
    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("awaitFeedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";
}

function noTodoMessage() {
    const toDoContainer = document.getElementById("toDo");
    const hasTasks = toDoContainer.children.length > 0;
    const noTaskMessage = toDoContainer.querySelector(".board-no-task");
    if (!hasTasks && !noTaskMessage) {
        toDoContainer.innerHTML += /*html*/ `
            <div class="board-content">
                <div class="board-no-task">No tasks to do</div>
            </div>
        `;
    } else if (hasTasks && noTaskMessage) {
        noTaskMessage.parentNode.remove();
    }
}

// progress bar
function updateProgressBar(task) {
    let currentSubtask = 0;
    let percent = (currentSubtask + 1) / task["subtasks"].length;
    if (percent !== Infinity) {
        percent = Math.round(percent * 100);
        document.getElementById("progress-bar").style.width = `${percent}%`;
        let test = percentageToFraction(percent);
        // console.log(test);
        // progress bar steps
        document.getElementById("subtask-progress-text").innerHTML += `${test}`;
    } else {
        return;
    }
}

function percentageToFraction(percentage) {
    let decimal = percentage / 100;
    let gcd = function (a, b) {
        if (b < 0.0000001) return a;
        return gcd(b, Math.floor(a % b));
    };
    let numerator = decimal * 10000;
    let denominator = 10000;
    let divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
    return numerator + "/" + denominator;
}

// HTML Task Card

function createHTML(task, containerId, returnHtml = false) {
    // console.log(task.sub_users)
    let userInitialsHtml = generateUserInitialsHtml(task.sub_users);
    let taskHtml = /*html*/ `
    <div class="board-content" onclick="openDetails(${task.taskId})" ondragstart="startDragging(${task.taskId})" draggable="true"> 
        <div class="board-body">
            <div class="board-task-card">
                <h3 class="btc-type ${setCategoryStyle(task.heading)}">${task.heading}</h3>
                <div class="btc-group">
                    <div class="btc-title">${task.title}</div>
                    <div class="btc-description">${task.description}</div>
                </div>
                <div class="board-task-progress-group">
                    <div class="board-task-max-bar">
                        <div id="progress-bar" class="board-task-value-bar"></div>
                    </div>
                    <div id="subtask-progress-text" class="board-task-progress-text"></div>
                </div>
                <div class="user-priority-group">
                    <div class="board-user-group">
                        ${userInitialsHtml}
                    </div>
                    ${showPriority(task)}
                </div>
            </div>
        </div>
    </div>`;
    if (returnHtml) {
        return taskHtml;
    } else {
        if (containerId) {
            document.getElementById(containerId).innerHTML += taskHtml;
        }
    }
}

async function openDetails(taskId) {
    currentDisplayedTaskId = taskId;
    const task = boardTasks.find((task) => task.taskId === taskId);
    if (!task) {
        console.error("Todo item not found");
        return;
    }
    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./templates/board-overlay-blue.html");
    await includeHTML();
    insertTaskDataIntoDialog(task, dialog);
    dialog.showModal();
    setupCloseDialogMechanism();
}

function renderEditAndDeleteSection(task) {
    let ContentHTML = "";
    ContentHTML += /*html*/ `
        <button class="dbt-button" onclick="deleteTask(${task.taskId})">
            <img src="./img/delete.png" alt="delete">
            <div class="dbt-button-text">Delete</div>
        </button>
        <img class="dbt-button-separator" src="./img/vector-board-form.png" alt="vertical-line-dbt">
        <button class="dbt-button" onclick="editTask(${task.taskId})">
            <img src="./img/edit2.png" alt="edit">
            <div class="dbt-button-text">Edit</div>
        </button>
    
    `;

    return ContentHTML;
}

function addTaskFromBoard() {
    console.log("add task button board working");
}

// NOT FINISHED YET
async function editTask(taskId) {
    console.log(taskId)
    const task = boardTasks.find((task) => task.taskId === taskId);

    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./edit-task.html");

    await includeHTML();
    dialog.showModal();

    setupCloseDialogMechanism();
}

async function deleteTask(taskId) {
    const taskIndex = boardTasks.findIndex((t) => t.taskId === taskId);
    boardTasks.splice(taskIndex, 1);
    closeDialog("dialog");
    await setItem("boardTasks", JSON.stringify(boardTasks));
    renderEachTask();
}

// overlay
function insertTaskDataIntoDialog(task, dialog) {
    const type = dialog.querySelector(".dbt-type");
    const title = dialog.querySelector(".dbt-title");
    const description = dialog.querySelector(".dbt-description");
    const priority = dialog.querySelector(".dbt-priority");
    const date = dialog.querySelector(".dbt-date");
    const subtask = dialog.querySelector(".dbt-collector");
    const subUsersNames = generateSubUsersHtml(task.sub_users);
    let subtaskText = document.getElementById("subtask-content");
    contentHTML = document.getElementById("deleteAndEditTask");

    type.classList.add(`${setCategoryStyle(task.heading)}`);
    type.innerText = task.heading;
    title.innerText = task.title;
    description.innerText = task.description;
    priority.innerHTML = task.priority + showPriority(task);
    date.innerHTML = task.date;
    subtask.innerHTML = subUsersNames;
    subtaskText.innerHTML = subTasksRender(task);
    contentHTML.innerHTML = renderEditAndDeleteSection(task);
}

function subTasksRender(task) {
    let subtasksHtml = "";
    for (let i = 0; i < task["subtasks"].length; i++) {
        const subtask = task["subtasks"][i];
        let imagePath;
        if (subtask.isChecked) {
            imagePath = "./img/checkmark.png";
        } else {
            imagePath = "./img/checkmark-unchecked.png";
        }
        subtasksHtml += /*html */ `
            <div onclick="subtaskStatus(${task.taskId}, ${subtask.subtaskId})" class="dbt-subtask-group">
                <img class="dbt-subtask-img" src="${imagePath}" alt="check-button-complete">
                <div class="dbt-subtask-text">${subtask.subtasksText}</div>
            </div>
        `;
    }
    return subtasksHtml;
}

async function subtaskStatus(taskId, subtaskId) {
    let task = boardTasks.find((t) => t.taskId === taskId);
    let dialog = document.getElementById("dialog");
    let subtask = task.subtasks.find((st) => st.subtaskId === subtaskId);

    subtask.isChecked = !subtask.isChecked;
    await setItem("boardTasks", JSON.stringify(boardTasks));
    insertTaskDataIntoDialog(task, dialog);
}

function generateSubUsersHtml(subUsers) {
    let subUserNamesHtml = "";

    if (subUsers && subUsers.length > 0) {
        subUsers.forEach((user) => {
            const initials = user.name
                .match(/(\b\S)?/g)
                .join("")
                .toUpperCase();
            const fullName = user.name;
            subUserNamesHtml += /*html*/ `
                <div class="dbt-contact-group">
                        <div class="dbt-contact-profile dbt-${user.userBackgroundColor}">${initials}</div>
                        <div class="dbt-contact-name">${fullName}</div>
                </div>
            `;
        });
    } else {
        subUserNamesHtml = '<div class="dbt-contact-name">No users assigned</div>';
    }
    return subUserNamesHtml;
}

// Help functions
function showPriority(task) {
    if (task.priority === "Urgent") {
        return '<img src="./img/urgent-board.png"></img>';
    } else if (task.priority === "Medium") {
        return '<img src="./img/medium-board.png"></img>';
    } else if (task.priority === "Low") {
        return '<img src="./img/low-board.png"></img>';
    }
}

function setCategoryStyle(heading) {
    if (heading == "User Story") {
        return "btc-type-blue";
    } else if (heading == "Technical Task") {
        return "btc-type-green";
    }
}

function generateUserInitialsHtml(subUsers) {
    if (subUsers === undefined) {
        return;
    } else {
        let userInitialsHtml = "";
        for (let user of subUsers) {
            const initials = user.name
                .match(/(\b\S)?/g)
                .join("")
                .toUpperCase();
            userInitialsHtml += `<div class="board-card-user bcu-${user.userBackgroundColor}">${initials}</div>`;
        }
        return userInitialsHtml;
    }
}

function setupCloseDialogMechanism() {
    const dialogBoardTask = document.querySelector(".dialog-board-task");
    const dialogEditTask = document.querySelector(".dialog-edit-task");
    const dialog = document.getElementById("dialog");

    dialog.addEventListener("click", function (event) {
        closeDialog("dialog");
    });
    // prevent closing dialog if element itself is clicked
 
    if (dialogBoardTask) {
        dialogBoardTask.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    if (dialogEditTask) {
        dialogEditTask.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

function moveTo(category) {
    const categories = ["toDo", "inProgress", "awaitFeedback", "done"];
    categories.forEach((cat) => {
        const element = document.getElementById(cat);
        if (element.classList.contains("highlight")) {
            element.classList.remove("highlight");
        }
    });
    const task = boardTasks.find((task) => task.taskId === currentDraggedElement);
    task.category = category;
    setItem("boardTasks", JSON.stringify(boardTasks))
    renderEachTask();
}

function highlight(event, category) {
    event.preventDefault();
    const categoryElement = document.getElementById(category);
    let highlightElement = categoryElement.querySelector(".highlight-placeholder");
    if (!highlightElement) {
        highlightElement = document.createElement("div");
        highlightElement.className = "highlight-placeholder";
        categoryElement.appendChild(highlightElement);
    }
    const draggedElementHtml = getDraggedElementData();
    highlightElement.innerHTML = draggedElementHtml;
}

function removeHighlight(event, category) {
    const categoryElement = document.getElementById(category);
    if (!categoryElement.contains(event.relatedTarget)) {
        const existingHighlight = categoryElement.querySelector(".highlight-placeholder");
        if (existingHighlight) {
            existingHighlight.remove();
        }
    }
}

function getDraggedElementData() {
    const task = boardTasks.find((t) => t.taskId === currentDraggedElement);
    if (!task) {
        console.error("Dragged element not found");
        return "";
    }
    // use createHTML with boolean true to get the html for rendering of the dragged element
    const taskHtml = createHTML(task, null, true);
    return taskHtml;
}

let searchTimeout;
function searchForTask() {
    clearTimeout(searchTimeout);
    let searchInput = document.getElementById("board-search-desktop").value.toLowerCase() || document.getElementById("board-search").value.toLowerCase();
    if (searchInput === "") {
        matchingBoardTask = [];
        renderEachTask();
        return;
    }
    searchTimeout = setTimeout(function () {
        matchingBoardTask = [];
        for (let i = 0; i < boardTasks.length; i++) {
            let task = boardTasks[i];
            let lowerCaseTask = task.title.toLowerCase();
            isTaskInMatching = matchingBoardTask.some((matchingBoardTask) => matchingBoardTask.title === lowerCaseTask);
            if (lowerCaseTask.includes(searchInput) && !isTaskInMatching) {
                matchingBoardTask.push(task);
            }
            renderMatchingTask();
        }
    }, 300);
}
// x axis scroll with mouse wheel
document.addEventListener('DOMContentLoaded', () => {
    let scrollElements = document.getElementsByClassName('horizontal-scroll');
    Array.from(scrollElements).forEach(element => {
        element.addEventListener('wheel', (event) => {
            event.preventDefault();
            element.scrollBy({
                left: event.deltaY < 0 ? -30 : 30,
            });
        });
    });
});



