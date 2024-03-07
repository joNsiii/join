/**
 * Renders each task in the board.
 */
function renderEachTask() {
    clearHTML();
    for (let i = 0; i < boardTasks.length; i++) {
        const task = boardTasks[i];
        let containerId = "";
        checkCategory(task, containerId);
        updateProgressBar(task);
    }
    updateAllNoTaskMessages();
}

/**
 * Renders tasks that match the search criteria.
 */
function renderMatchingTask() {
    clearHTML();
    for (let i = 0; i < matchingBoardTask.length; i++) {
        const task = matchingBoardTask[i];
        let containerId = "";
        checkCategory(task, containerId);
        updateProgressBar(task);
    }
    updateAllNoTaskMessages();
}

/**
 * Generates HTML content for a task card and appends it to the specified container.
 * @param {Object} task - The task object to create HTML for.
 * @param {string} containerId - The container ID to append the task card to.
 * @param {boolean} returnHtml - If true, returns the generated HTML string instead of appending it.
 * @returns {string|undefined} The task HTML if returnHtml is true, otherwise undefined.
 */
function createHTML(task, containerId, returnHtml = false) {
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
                        <div id="progress-bar-${task.taskId}" class="board-task-value-bar"></div>
                    </div>
                    <div id="subtask-progress-text-${task.taskId}" class="board-task-progress-text"></div>
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

/**
 * Clears the HTML content of each category container.
 */
function clearHTML() {
    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("awaitFeedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";
}

/**
 * Updates the "no task" message for a specific category if there are no tasks.
 * @param {string} containerId - The container ID to update the message for.
 * @param {string} message - The message to display.
 */
function updateNoTaskMessage(containerId, message) {
    const container = document.getElementById(containerId);
    const hasTasks = container.children.length > 0;
    const noTaskMessage = container.querySelector(".board-no-task");
    if (!hasTasks && !noTaskMessage) {
        container.innerHTML += /*html*/ `
            <div class="board-content">
                <div class="board-no-task">${message}</div>
            </div>
        `;
    } else if (hasTasks && noTaskMessage) {
        noTaskMessage.parentNode.remove();
    }
}

/**
 * Generates HTML content for editing and deleting task options.
 * @param {Object} task - The task object.
 * @returns {string} The HTML content for the edit and delete section.
 */
function renderEditAndDeleteSection(task) {
    let ContentHTML = "";
    ContentHTML += /*html*/ `
        <button class="dbt-button" onclick="deleteTask(${task.taskId})">
            <div class="delete-contact-img-form"></div>
            <div class="dbt-button-text">Delete</div>
        </button>
        <img class="dbt-button-separator" src="./img/vector-board-form.png" alt="vertical-line-dbt">
        <button class="dbt-button" onclick="editTask(${task.taskId})">
            <div class="edit-contact-img-form"></div>
            <div class="dbt-button-text">Edit</div>
        </button>
    `;
    return ContentHTML;
}

/**
 * Renders the subtasks of a task.
 * @param {Object} task - The task object.
 * @returns {string} HTML content of subtasks.
 */
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

/**
 * Generates HTML content for displaying user initials.
 * @param {Array} subUsers - The array of user objects.
 * @returns {string} HTML content of user initials.
 */
function generateSubUsersHtml(subUsers) {
    let subUserNamesHtml = "";

    if (subUsers && subUsers.length > 0) {
        subUsers.forEach((user) => {
            const initials = getFirstLastInitial(user.name);
            const fullName = user.name;
            subUserNamesHtml += /*html*/ `
                <div class="dbt-contact-group">
                        <div class="dbt-contact-profile bgc-${user["bgc-name"]}">${initials}</div>
                        <div class="dbt-contact-name">${fullName}</div>
                </div>
            `;
        });
    } else {
        subUserNamesHtml = '<div class="dbt-contact-name">No users assigned</div>';
    }
    return subUserNamesHtml;
}

/**
 * Generates HTML for user initials to be displayed on the task card.
 * @param {Array} subUsers - The array of user objects.
 * @returns {string} HTML content of user initials for the task card.
 */
function generateUserInitialsHtml(subUsers) {
    if (subUsers === undefined) {
        return;
    } else {
        let userInitialsHtml = "";
        for (let user of subUsers) {
            const initials = getFirstLastInitial(user.name);
            userInitialsHtml += `<div class="board-card-user bgc-${user["bgc-name"]}">${initials}</div>`;
        }
        return userInitialsHtml;
    }
}

/**
 * Shows the priority icon for a task based on its priority level.
 * @param {Object} task - The task object.
 * @returns {string} HTML string of the priority icon.
 */
function showPriority(task) {
    if (task.priority === "Urgent") {
        return '<img src="./img/urgent-board.png"></img>';
    } else if (task.priority === "Medium") {
        return '<img src="./img/medium-board.png"></img>';
    } else if (task.priority === "Low") {
        return '<img src="./img/low-board.png"></img>';
    }
}