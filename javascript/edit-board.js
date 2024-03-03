currentTask = [];
selectedUsers = [];
let priority;
/**
 * Initiates the editing process for a specific task by loading task information into the editing dialog and displaying it.
 * This function finds the task by its ID, copies the users assigned to it, sets up the dialog with the task's details,
 * and then fills the form with these details. It also handles displaying the user profile, subtasks, and setting the task priority in the UI.
 * @async
 * @param {number} taskId The ID of the task to be edited.
 */
async function editTask(taskId) {
    const task = boardTasks.find((task) => task.taskId === taskId);
    selectedUsers = JSON.parse(JSON.stringify(task.sub_users));
    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./edit-task.html");
    await includeHTML();
    dialog.showModal();
    setupCloseDialogMechanism();
    fillFormWithTaskDetails(task);
    renderUserProfile();
    displaySubtasksForEditing(task.taskId);
    setPrioritySelection(task.priority);
    document.getElementById("task-id-test").value = taskId;
    editAssignedToUser(task);
    loadUserImage();
}
/**
 * fill form fields with task details.
 * @param {Object} task Task object with title, description, due date, and category.
 */
function fillFormWithTaskDetails(task) {
    document.getElementById("title-task").value = task.title;
    document.getElementById("description-task").value = task.description;
    document.getElementById("date-date-task").value = task.dueDate;
    document.getElementById("category").value = task.heading;
}
/**
 * Updates the text of a subtask.
 * @param {number} taskId The ID of the task to which the subtask belongs.
 * @param {number} subtaskId The ID of the subtask to be updated.
 * @param {string} newText The new text for the subtask.
 */
function updateTaskProperties(taskToUpdate) {
    taskToUpdate.title = document.getElementById("title-task").value || taskToUpdate.title;
    taskToUpdate.description = document.getElementById("description-task").value || taskToUpdate.description;
    taskToUpdate.dueDate = document.getElementById("date-date-task").value || taskToUpdate.dueDate;
    taskToUpdate.heading = document.getElementById("category").value || taskToUpdate.heading;
}
/**
 * finds a task by its ID and updates its properties, priority, subtasks, and assigned users.
 * this function handles the entire update process by first finding the task in the `boardTasks` array,
 * then updating its properties and priority, appending any new subtasks from the `currentTask` array,
 * and finally updating the list of assigned users.
 * @async
 * @param {number|string} taskId The ID of the task to update.
 */
async function findTaskAndUpdate(taskId) {
    const task = findTaskById(taskId);
    if (!task) {
        console.error("Task not found.");
        return;
    }
    updateTaskDetails(task);
    updateSubtasksAndUsers(task);
    await setItem("boardTasks", JSON.stringify(boardTasks));
    closeDialog("dialog");
    renderEachTask();
    currentTask = [];
}
/**
 * Finds a task by its ID.
 * @param {number|string} taskId The ID of the task.
 * @returns {Object|null} The found task object or null if not found.
 */
function findTaskById(taskId) {
    taskId = parseInt(taskId, 10);
    const taskIndex = boardTasks.findIndex((task) => task.taskId === taskId);
    return taskIndex !== -1 ? boardTasks[taskIndex] : null;
}
/**
 * Updates subtasks and assigned users of a task.
 * @param {Object} task The task object to update.
 */
function updateSubtasksAndUsers(task) {
    if (Object.entries(currentTask).length !== 0) {
        task.subtasks.push(...currentTask);
    }
    task.sub_users = [...selectedUsers];
}
/**
 * Updates the properties of a given task.
 * @param {Object} task The task object to update.
 */
function updateTaskDetails(task) {
    updateTaskProperties(task);
    updatePriority(task);
}
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
 * Updates the text of a subtask.
 * @param {number} taskId The ID of the task to which the subtask belongs.
 * @param {number} subtaskId The ID of the subtask to be updated.
 * @param {string} newText The new text for the subtask.
 */
function updateSubtaskText(taskId, subtaskId, newText) {
    const task = boardTasks.find((t) => t.taskId === taskId);
    const subtask = task.subtasks.find((st) => st.subtaskId === subtaskId);
    subtask.subtasksText = newText;
}
/**
 * removes a subtask from the editing and updates the display.
 * @async
 * @param {number} taskId The ID of the task from which a subtask is to be removed.
 * @param {number} subtaskId The ID of the subtask to be removed.
 */
async function deleteSubtaskFromEditing(taskId, subtaskId) {
    const taskIndex = boardTasks.findIndex((t) => t.taskId === taskId);
    if (taskIndex > -1) {
        const subtaskIndex = boardTasks[taskIndex].subtasks.findIndex((st) => st.subtaskId === subtaskId);
        if (subtaskIndex > -1) {
            boardTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
            displaySubtasksForEditing(taskId);
        }
    }
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
 * creates a new subtask with the given input value and ID, then adds it to the current task list.
 * this function assumes a global variable `currentTask` exists and is an array that tracks the current set of subtasks.
 * each subtask is represented as an object with an ID, text, and a checked status to indicate if it's completed.
 *
 * @param {string} subtaskInputValue The text content for the new subtask.
 * @param {number|string} newSubtaskId A unique identifier for the new subtask. Can be a number or string depending on the ID generation strategy.
 */
function createNewSubtask(subtaskInputValue, newSubtaskId) {
    let subtask = {
        subtaskId: newSubtaskId,
        subtasksText: subtaskInputValue,
        isChecked: false,
    };
    currentTask.push(subtask);
}
/**
 * removes a subtask from the current editing session and updates the display.
 * @param {string} subtaskId The ID of the subtask to be removed.
 */
function deleteSubtask(subtaskId) {
    const subtaskIndex = currentTask.findIndex((subtask) => subtask.subtaskId === subtaskId);
    currentTask.splice(subtaskIndex, 1);
    const subtaskSpan = document.getElementById(`sub-span-${subtaskId}`);
    if (subtaskSpan) {
        subtaskSpan.parentNode.removeChild(subtaskSpan);
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
 * Adds an event listener to cancel subtask editing when clicking outside the editing area.
 */
function cancelSubtaskEdit(event) {
    if (event) event.stopPropagation();
    document.getElementById("subtask").value = "";
    resetSubtaskIcons();
}
/**
 * Adds an event listener to cancel subtask editing when clicking outside the editing area.
 */
function cancelSubtaskEditSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = document.getElementById("subtask-form");
        let subtaskInput = document.getElementById("subtask");
        if (subtaskForm && event.target !== subtaskInput && !subtaskForm.contains(event.target) && subtaskInput.value === "") {
            cancelSubtaskEdit();
        }
    });
}
/**
 * Resets the icons in the UI for adding subtasks.
 */
function resetSubtaskIcons() {
    const addSubtaskIcon = document.getElementById("icon-hold");
    addSubtaskIcon.innerHTML = `
        <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="initializeSubtaskEditing()">
    `;
}
/**
 * finds a task by its ID.
 * @param {number} taskId The ID of the task to find.
 * @return {Object|undefined} The found task or undefined if no task was found.
 */
function findTask(taskId) {
    return boardTasks.find((t) => t.taskId === taskId);
}
/**
 * Finds a subtask by its ID within a specific task.
 * @param {Object} task The task in which to search for the subtask.
 * @param {number} subtaskId The ID of the subtask to find.
 * @return {Object|undefined} The found subtask or undefined if no subtask was found.
 */
function findSubtask(task, subtaskId) {
    return task.subtasks.find((st) => st.subtaskId === subtaskId);
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
 * toggles the focus status of a subtask between editing and viewing mode.
 * updates the user interface according to the focus status.
 * @param {number} taskId The ID of the task to which the subtask belongs.
 * @param {number} subtaskId The ID of the subtask whose focus status is to be changed.
 * @param {boolean} isFocusing Indicates whether to set (true) or remove (false) the focus on the subtask.
 */
function toggleSubtaskFocus(taskId, subtaskId, isFocusing) {
    const task = findTask(taskId);
    if (!task) {
        console.error("Task not found.");
        return;
    }
    const subtask = findSubtask(task, subtaskId);
    if (!subtask) {
        console.error("Subtask not found.");
        return;
    }
    if (isFocusing) {
        updateUIForFocus(subtaskId, taskId);
    } else {
        const subtaskContentElement = document.getElementById(`sub-content-${subtaskId}`);
        let currentSubtaskValue = subtaskContentElement.innerText.trim();
        subtask.subtasksText = currentSubtaskValue;
        updateUIForBlur(subtaskId, taskId, currentSubtaskValue);
    }
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

/**
 * updates the priority of a task based on user selection.
 * @param {Object} taskToUpdate The task object to be updated.
 */
function updatePriority(taskToUpdate) {
    const priorities = ["Urgent", "Medium", "Low"];
    priorities.forEach((priority) => {
        if (document.getElementById(priority).classList.contains("selected")) {
            taskToUpdate.priority = priority;
        }
    });
}
/**
 * saves the priority selection in the user interface.
 * @param {HTMLElement} clickedPrio The clicked priority element.
 */
function saveNewPrio(clickedPrio) {
    ["Urgent", "Medium", "Low"].forEach((prio) => {
        document.getElementById(prio).classList.remove("selected");
    });
    clickedPrio.classList.add("selected");
}
/**
 * Renders selected users based on their initials and background color.
 */
function renderUserProfile() {
    const subProfileContainer = document.getElementById("sub-profile");
    subProfileContainer.innerHTML = "";

    selectedUsers.forEach((user) => {
        const initials = user.name
            .match(/(\b\S)?/g)
            .join("")
            .toUpperCase();
        subProfileContainer.innerHTML += `
        <div class="board-card-user-edit bgc-${user["bgc-name"]}">${initials}</div>
        `;
    });
}
/**
 * opens edit for the assigned users to a task.
 * @param {Object} task The task for which users are to be assigned or edited.
 */
function editAssignedToUser(task) {
    let selectField = document.getElementById("myDropdown");
    getSelectedUsers(task, selectField);
}
/**
 * selects a user for assignment to a task or removes them from the selection.
 * updates the user interface accordingly.
 * @param {number} id The ID of the user.
 * @param {number} i The index of the user in the user interface.
 */
function selectUser(id, i) {
    let userObject = users.find((u) => u.userId === id);
    let isUserAlreadySelected = selectedUsers.some((selectedUser) => selectedUser.userId === id);
    if (!isUserAlreadySelected) {
        // if user not selected push in array
        selectedUsers.push(userObject);
        console.log("selectedUsers:", selectedUsers);
    } else {
        //if user selected remove
        current = selectedUsers.findIndex((user) => user.userId == id);
        selectedUsers.splice(current, 1);
        console.log("selectedUsers nach Entfernung:", selectedUsers);
    }
    toggleSelectedUser(id, i);
    renderUserProfile();
}
/**
 * toggles between selected und not selected user and displays different CSS + IMG for each.
 * @param {number} id The ID of the user.
 * @param {number} i The index of the user in the user interface.
 */
function toggleSelectedUser(id, i) {
    let imgSource = document.getElementById(`checkbox-remember-me-${i}`);
    let background = document.getElementById(`subuser-div-${i}`);
    if (imgSource.src.includes("img/checkmark-white.png")) {
        background.classList.remove("sub-background");
        imgSource.src = "img/checkmark-unchecked.png";
    } else {
        imgSource.src = "img/checkmark-white.png";
        background.classList.add("sub-background");
    }
}
/**
 * retrieves the selected users for a task and updates the user interface accordingly.
 * @param {Object} task The task for which the selected users are to be retrieved.
 * @param {HTMLElement} selectField The HTML element representing the selected users.
 */
function getSelectedUsers(task, selectField) {
    let selectedUsers = task.sub_users;

    for (let i = 0; i < users.length; i++) {
        let user = users[i].name;
        let bgc = users[i]["bgc-name"];
        let userId = users[i].userId;
        let initials = users[i].initials
        selectField.innerHTML += generateHTMLUser(i, userId, bgc, user, selectedUsers, initials);
    }
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
 * checks if a user has already been selected.
 * @param {number} userId The ID of the user to check.
 * @param {Array} selectedUsers The list of currently selected users.
 * @return {Object} An object with information about the user's selection and UI representation.
 */
function userIsSelected(userId, selectedUsers) {
    const isSelected = selectedUsers.some((user) => user.userId === userId);
    return {
        checkboxImage: isSelected ? "./img/checkmark-white.png" : "./img/checkmark-unchecked.png",
        backgroundClass: isSelected ? "sub-background" : "",
    };
}
