let currentDraggedElement;
let matchingBoardTask = [];
let boardTasks = [];
let searchTimeout;
/**
 * Loads tasks into the board from storage.
 */
async function loadTasksInBoard() {
    try {
        boardTasks = JSON.parse(await getItem("boardTasks"));
    } catch (error) {
        console.log(error);
    }
}
/**
 * Initializes the board by loading tasks and applying guest settings.
 */
async function boardInit() {
    await init();
    await applyGuestSettings();
    await loadTasksInBoard();
    await loadAssignableContacts();
    await removeDeletedSubusers();
    renderEachTask();
}
/**
 * Applies settings for guest users such as disabling the task addition button and hiding task management icons.
 */
async function applyGuestSettings() {
    if (!userIsLoggedIn()) {
        let boardTaskButton = document.getElementById("board-task-button");
        boardTaskButton.disabled = true;
        for (let i = 1; i < 4; i++) {
            let boardTaskIcon = document.getElementById(`board-task-icon-${i}`);
            boardTaskIcon.style.display = "none";
        }
    }
}

/**
 * Determines the tasks category and assigns it to the correct container.
 * @param {Object} task - The task object.
 * @param {string} containerId - The ID of the container where the task belongs.
 */
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

/**
 * Updates the "no task" messages for all categories.
 */
function updateAllNoTaskMessages() {
    const columns = [
        { id: "toDo", message: "No tasks To do" },
        { id: "inProgress", message: "No tasks In progress" },
        { id: "awaitFeedback", message: "No tasks Await feedback" },
        { id: "done", message: "No tasks Done" },
    ];
    columns.forEach((column) => {
        updateNoTaskMessage(column.id, column.message);
    });
}
/**
 * Updates the progress bar for a task based on the completion status of its subtasks.
 * @param {Object} task - The task to update the progress for.
 */
function updateProgressBar(task) {
    let isChecked = [];
    let length = task.subtasks.length;
    let checked = task.subtasks["isChecked"];
    isChecked[checked] = task.subtasks.filter((c) => c["isChecked"] == true);
    checkedLength = isChecked[checked].length;
    document.getElementById(`subtask-progress-text-${task.taskId}`).innerHTML += checkedLength + "/" + length;
    progressBarPercent(task, length, checkedLength);
}

function progressBarPercent(task, length, checkedLength) {
    let percent = (100 * checkedLength) / length;
    document.getElementById(`progress-bar-${task.taskId}`).style.width = percent + "%";
}

/**
 * Opens the task details dialog for editing or viewing.
 * @param {number} taskId - The ID of the task to open details for.
 */
async function openDetails(taskId) {
    currentDisplayedTaskId = taskId;
    const task = boardTasks.find((task) => task.taskId === taskId);
    if (!task) {
        console.error("Task item not found");
        return;
    }
    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./templates/board-overlay-blue.html");
    await includeHTML();
    insertTaskDataIntoDialog(task, dialog);
    dialog.showModal();
    setupCloseDialogMechanism();
    loadUserImage();
    if (!userIsLoggedIn()) {
        let overlayButtonBar = document.getElementById("deleteAndEditTask");
        overlayButtonBar.style.display = "none";
    }
}

/**
 * Deletes a task from the board.
 * @param {number} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    const taskIndex = boardTasks.findIndex((t) => t.taskId === taskId);
    boardTasks.splice(taskIndex, 1);
    closeDialog("dialog");
    await setItem("boardTasks", JSON.stringify(boardTasks));
    renderEachTask();
}
/**
 * inserts task data into a dialog for viewing.
 * @param {Object} task - The task object to insert data for.
 * @param {HTMLElement} dialog - The dialog element to insert data into.
 */
function insertTaskDataIntoDialog(task, dialog) {
    basicTaskDetails(task, dialog);
    insertSubTasks(task, dialog);
    const priority = dialog.querySelector(".dbt-priority");
    const date = dialog.querySelector(".dbt-date");
    let contentHTML = document.getElementById("deleteAndEditTask");
    priority.innerHTML = task.priority + showPriority(task);
    date.innerHTML = task.dueDate;
    contentHTML.innerHTML = renderEditAndDeleteSection(task);
}
/**
 * Inserts basic task details into the dialog.
 * @param {Object} task - The task object.
 * @param {HTMLElement} dialog - The dialog element.
 */
function basicTaskDetails(task, dialog) {
    const type = dialog.querySelector(".dbt-type");
    const title = dialog.querySelector(".dbt-title");
    const description = dialog.querySelector(".dbt-description");

    type.classList.add(setCategoryStyle(task.heading));
    type.innerText = task.heading;
    title.innerText = task.title;
    description.innerText = task.description;
}
/**
 * Inserts sub-tasks and sub-users names into the dialog.
 * @param {Object} task - The task object.
 * @param {HTMLElement} dialog - The dialog element.
 */
function insertSubTasks(task, dialog) {
    const subtaskCollector = dialog.querySelector(".dbt-collector");
    const subtaskContent = document.getElementById("subtask-content");
    const subUsersNames = generateSubUsersHtml(task.sub_users);
    subtaskCollector.innerHTML = subUsersNames;
    subtaskContent.innerHTML = subTasksRender(task);
}

/**
 * Toggles the completion status of a subtask.
 * @param {number} taskId - The parent task ID.
 * @param {number} subtaskId - The subtask ID to toggle status for.
 */
async function subtaskStatus(taskId, subtaskId) {
    let task = boardTasks.find((t) => t.taskId === taskId);
    let dialog = document.getElementById("dialog");
    let subtask = task.subtasks.find((st) => st.subtaskId === subtaskId);

    subtask.isChecked = !subtask.isChecked;
    await setItem("boardTasks", JSON.stringify(boardTasks));
    insertTaskDataIntoDialog(task, dialog);
}

/**
 * Sets the category style class for a task based on its heading.
 * @param {string} heading - The task heading.
 * @returns {string} The class name for the task category.
 */
function setCategoryStyle(heading) {
    if (heading == "User Story") {
        return "btc-type-blue";
    } else if (heading == "Technical Task") {
        return "btc-type-green";
    }
}

/**
 * sets up mechanisms to close the task details dialog and render all tasks.
 */
function setupCloseDialogMechanism() {
    const dialogBoardTask = document.querySelector(".dialog-board-task");
    const dialogEditTask = document.querySelector(".dialog-edit-task");
    const dialog = document.getElementById("dialog");
    dialog.addEventListener("click", function (event) {
        closeDialog("dialog");
    });
    if (dialogBoardTask) {
        dialogBoardTask.addEventListener("click", function (event) {
            event.stopPropagation();
            renderEachTask();
        });
    }
    if (dialogEditTask) {
        dialogEditTask.addEventListener("click", function (event) {
            event.stopPropagation();
            renderEachTask();
        });
    }
    renderEachTask();
    loadUserImage();
}
/**
 * Initiates dragging of a task card.
 * @param {number} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}
/**
 * Allows dropping of a task card into a category.
 * @param {Event} event - The drag event.
 */
function allowDrop(event) {
    event.preventDefault();
}
/**
 * Moves a dragged task to a specified category.
 * @param {string} category - The category to move the task to.
 */
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
    setItem("boardTasks", JSON.stringify(boardTasks));
    renderEachTask();
}
/**
 * Highlights a drop area when a task card is dragged over it.
 * @param {Event} event - The dragover event.
 * @param {string} category - The category being dragged over.
 */
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
/**
 * removes highlight from a drop area when a task card is dragged away.
 * @param {Event} event - The dragleave event.
 * @param {string} category - The category being dragged away from.
 */
function removeHighlight(event, category) {
    const categoryElement = document.getElementById(category);
    if (!categoryElement.contains(event.relatedTarget)) {
        const existingHighlight = categoryElement.querySelector(".highlight-placeholder");
        if (existingHighlight) {
            existingHighlight.remove();
        }
    }
}
/**
 * gets the HTML data of the currently dragged element.
 * @returns {string} HTML content of the dragged element.
 */
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

/**
 * searches for a task based on user input and updates the board with matching tasks.
 */
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
            let taskDescription = task.description.toLowerCase();
            isTaskInMatching = matchingBoardTask.some((matchingBoardTask) => matchingBoardTask.title === lowerCaseTask);
            if (lowerCaseTask.includes(searchInput) || taskDescription.includes(searchInput) && !isTaskInMatching) {
                matchingBoardTask.push(task);
            }
            renderMatchingTask();
        }
    }, 300);
}
/**
 * Enables horizontal scrolling for elements with the "horizontal-scroll" class using the mouse wheel.
 * attaches a 'wheel' event listener to each element upon DOM content load
 * allowing users to scroll horizontally.
 */
document.addEventListener("DOMContentLoaded", () => {
    let scrollElements = document.getElementsByClassName("horizontal-scroll");
    Array.from(scrollElements).forEach((element) => {
        element.addEventListener("wheel", (event) => {
            event.preventDefault();
            element.scrollBy({
                left: event.deltaY < 0 ? -30 : 30,
            });
        });
    });
});

/**
 * Removes deleted subusers.
 */
async function removeDeletedSubusers() {
    for (let i = boardTasks.length - 1; i > -1; i--) {
        let subusers = boardTasks[i].sub_users;
        for (let j = subusers.length - 1; j > -1; j--) {
            let subuser = subusers[j];
            let isMailExisting = assignableContacts.find(u => u.mail === subuser.mail);
            let isIdExisting = assignableContacts.find(u => u.userId === subuser.userId);
            if (!isMailExisting || !isIdExisting) {
                boardTasks[i]['sub_users'].splice(j, 1);
            }
        }
    }
    await setItem('boardTasks', boardTasks);
}