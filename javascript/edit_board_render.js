/**
 * displays subtasks of a specific task for editing.
 * @param {number} taskId The ID of the task whose subtasks are to be displayed.
 */
function displaySubtasksForEditing(taskId) {
    const task = boardTasks.find((t) => t.taskId === taskId);
    if (!task) {
        console.error("Task not found");
        return;
    }
    const subtaskDisplayElement = document.getElementById("subtask-display");
    subtaskDisplayElement.innerHTML = "";
    task.subtasks.forEach((subtask) => {
        const subtaskHtml = `
            <span contenteditable="true" class="span-container" id="sub-span-${subtask.subtaskId}">
                <div class="subtask-preview" id="preview-${subtask.subtaskId}" onclick="toggleSubtaskFocus(${taskId}, ${subtask.subtaskId}, true)">
                    <div class="list-item" id="list-item-${subtask.subtaskId}"></div>
                    <p id="sub-content-${subtask.subtaskId}">${subtask.subtasksText}</p>
                </div>
                <div class="subtask-icon-container" id="icon-container-${subtask.subtaskId}">
                    <img src="./img/edit-contacts.png" alt="edit-icon" class="hover" onclick="toggleSubtaskFocus(${taskId}, ${subtask.subtaskId}, true)">
                    <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
                    <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtask.subtaskId})">
                </div>
            </span>
        `;
        subtaskDisplayElement.innerHTML += subtaskHtml;
    });
}

/**
 * adds a new subtask to the current editing session (to the current Task).
 * generates a unique ID for the new subtask and updates the display.
 */
function addNewSubtaskForEditing() {
    const subtaskInputValue = document.getElementById("subtask").value.trim();
    const subtaskDisplayElement = document.getElementById("subtask-display");

    if (subtaskInputValue !== "") {
        const newSubtaskId = Date.now();
        subtaskDisplayElement.innerHTML += `
            <span contenteditable="true" class="span-container" id="sub-span-${newSubtaskId}">
                <div class="subtask-preview" id="preview-${newSubtaskId}">
                    <div class="list-item" id="list-item-${newSubtaskId}"></div>
                    <p id="sub-content-${newSubtaskId}">${subtaskInputValue}</p>
                </div>
                <div class="subtask-icon-container" id="icon-container-${newSubtaskId}">
                    <img src="./img/edit-contacts.png" alt="edit-icon" class="hover">
                    <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
                    <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtask('${newSubtaskId}')">
                </div>
            </span>
        `;
        document.getElementById("subtask").value = "";
        resetSubtaskIcons();
        createNewSubtask(subtaskInputValue, newSubtaskId);
    }
}

/**
 * Initializes the user interface for editing subtasks.
 * Sets up the UI element for adding new subtasks.
 */
function initializeSubtaskEditing() {
    const addSubtaskIcon = document.getElementById("icon-hold");
    addSubtaskIcon.innerHTML = `
            <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtaskEdit()">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/done.png" alt="add-icon" class="hover" onclick="addNewSubtaskForEditing()">
        `;
    cancelSubtaskEditSafety();
}

/**
 * generates the HTML for a user in the Task (if task is edited) for assigned user selection.
 * @param {number} i The index of the user in the list.
 * @param {number} userId The ID of the user.
 * @param {string} bgc The background color for the user.
 * @param {string} user The name of the user.
 * @param {Array} selectedUsers The list of currently selected users.
 * @param {string} initials The initials of the user.
 * @return {string} The HTML string for a user.
 */
function generateHTMLUser(i, userId, bgc, user, selectedUsers, initials) {
    const { checkboxImage, backgroundClass } = userIsSelected(userId, selectedUsers);
    return ` <div class="subuser-selection ${backgroundClass}" onclick="selectUser(${userId}, ${i})" id="subuser-div-${i}">
            <div class="subuser-align">
            <div class="sub-profile-img bgc-${bgc}">${initials}</div>
            <div>${user}</div>
            </div>  
            <div class="checkbox"><img src="${checkboxImage}" alt="checkbox"
                id="checkbox-remember-me-${i}"></div>  
        </div>
    `;
}

/**
 * Renders selected users based on their initials and background color.
 */
function renderUserProfile() {
    const subProfileContainer = document.getElementById("sub-profile");
    subProfileContainer.innerHTML = "";
    selectedUsers.forEach((user) => {
        const initials = getFirstLastInitial(user.name);
        subProfileContainer.innerHTML += `
        <div class="board-card-user-edit bgc-${user["bgc-name"]}">${initials}</div>
        `;
    });
}

/**
 * updates the user interface to focus on a specific subtask.
 * @param {number} subtaskId The ID of the subtask to be focused.
 * @param {number} taskId The ID of the task to which the subtask belongs.
 */
function updateUIForFocus(subtaskId, taskId) {
    const subTaskSpan = document.getElementById(`sub-span-${subtaskId}`);
    const editIcon = document.getElementById(`icon-container-${subtaskId}`);
    const listItem = document.getElementById(`list-item-${subtaskId}`);
    const preview = document.getElementById(`preview-${subtaskId}`);

    subTaskSpan.classList.add("focus-input");
    listItem.classList.add("focus-list-item");
    preview.classList.add("focus-preview");

    editIcon.innerHTML = `
        <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtaskId})">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
        <img src="./img/done.png" alt="done-icon" class="hover" onclick="toggleSubtaskFocus(${taskId}, ${subtaskId}, false)">
    `;
}
/**
 * updates the user interface to remove focus from a specific subtask.
 * @param {number} subtaskId The ID of the subtask whose focus is to be removed.
 * @param {number} taskId The ID of the task to which the subtask belongs.
 * @param {string} currentSubtaskValue The current value of the subtask.
 */
function updateUIForBlur(subtaskId, taskId, currentSubtaskValue) {
    const subTaskSpan = document.getElementById(`sub-span-${subtaskId}`);
    const editIcon = document.getElementById(`icon-container-${subtaskId}`);
    const listItem = document.getElementById(`list-item-${subtaskId}`);
    const preview = document.getElementById(`preview-${subtaskId}`);

    subTaskSpan.classList.remove("focus-input");
    listItem.classList.remove("focus-list-item");
    preview.classList.remove("focus-preview");

    editIcon.innerHTML = `
        <img src="./img/edit-contacts.png" alt="edit-icon" class="hover" onclick="toggleSubtaskFocus(${taskId}, ${subtaskId}, true)">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
        <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtaskId})">
    `;
}

/**
 * Sets the priority for the task in the editing dialog.
 * @param {string} priority The priority of the task ('Low', 'Medium', 'Urgent').
 */
function setPrioritySelection(priority) {
    resetPrioritySelection();

    const priorityElement = document.getElementById(priority);
    let lowImg = document.getElementById("low-img");
    let mediumImg = document.getElementById("medium-img");
    let urgentImg = document.getElementById("urgent-img");

    if (priorityElement) {
        priorityElement.classList.add(`prio${priority}`);
        switch (priority) {
            case "Urgent":
                urgentImg.src = "./img/urgent-white-arrows.png";
                break;
            case "Medium":
                mediumImg.src = "./img/medium.png";
                break;
            case "Low":
                lowImg.src = "./img/low-white-arrows.png";
                break;
        }
    }
}

/**
 * Resets the priority selection visuals to their default state.
 */
function resetPrioritySelection() {
    document.getElementById("Urgent").classList.remove("prioUrgent");
    document.getElementById("Medium").classList.remove("prioMedium");
    document.getElementById("Low").classList.remove("prioLow");

    let lowImg = document.getElementById("low-img");
    let mediumImg = document.getElementById("medium-img");
    let urgentImg = document.getElementById("urgent-img");

    lowImg.src = "./img/low.png";
    mediumImg.src = "./img/medium-prio.png";
    urgentImg.src = "./img/urgent-red-arrows.png";
}