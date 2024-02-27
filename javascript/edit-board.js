currentTask = [];
let priority;
// NOT FINISHED YET
async function editTask(taskId) {
    const task = boardTasks.find((task) => task.taskId === taskId);
    console.log(task);
    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./edit-task.html");
    await includeHTML();
    dialog.showModal();
    setupCloseDialogMechanism();
    document.getElementById("title-task").value = task.title;
    document.getElementById("description-task").value = task.description;
    document.getElementById("date-date-task").value = task.date;
    document.getElementById("category").value = task.heading;

    displaySubtasksForEditing(task.taskId);
    setPrioritySelection(task.priority);
    document.getElementById("task-id-test").value = taskId;
    editAssignedToUser(task);
}

function setPrioritySelection(priority) {
    document.getElementById("Urgent").classList.remove("prioUrgent");
    document.getElementById("Medium").classList.remove("prioMedium");
    document.getElementById("Low").classList.remove("prioLow");

    let lowImg = document.getElementById("low-img");
    let mediumImg = document.getElementById("medium-img");
    let urgentImg = document.getElementById("urgent-img");

    lowImg.src = "./img/low.png";
    mediumImg.src = "./img/medium-prio.png";
    urgentImg.src = "./img/urgent-red-arrows.png";
    const priorityElement = document.getElementById(priority);
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

function updateSubtaskText(taskId, subtaskId, newText) {
    const task = boardTasks.find((t) => t.taskId === taskId);
    const subtask = task.subtasks.find((st) => st.subtaskId === subtaskId);
    subtask.subtasksText = newText;
}

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

function initializeSubtaskEditing() {
    const addSubtaskIcon = document.getElementById("icon-hold");
    addSubtaskIcon.innerHTML = `
            <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtaskEdit()">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/done.png" alt="add-icon" class="hover" onclick="addNewSubtaskForEditing()">
        `;
    cancelSubtaskEditSafety();
}

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
        let subtask = {
            subtaskId: newSubtaskId,
            subtasksText: subtaskInputValue,
            isChecked: false,
        };
        currentTask.push(subtask);
        console.log(currentTask);
    }
}
function cancelSubtaskEditSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = document.getElementById("subtask-form");
        let subtaskInput = document.getElementById("subtask");
        if (event.target !== subtaskInput && !subtaskForm.contains(event.target) && subtaskInput.value === "") {
            cancelSubtaskEdit();
        }
    });
}
function cancelSubtaskEdit(event) {
    if (event) event.stopPropagation();
    document.getElementById("subtask").value = "";
    resetSubtaskIcons();
}

function resetSubtaskIcons() {
    const addSubtaskIcon = document.getElementById("icon-hold");
    addSubtaskIcon.innerHTML = `
        <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="initializeSubtaskEditing()">
    `;
}
function findTask(taskId) {
    return boardTasks.find((t) => t.taskId === taskId);
}
function findSubtask(task, subtaskId) {
    return task.subtasks.find((st) => st.subtaskId === subtaskId);
}

// Funktion 3: Aktualisiere UI für Fokussierung
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

// Funktion 4: Aktualisiere UI für Nicht-Fokussierung
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

// main function
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

// Aktualisiert die grundlegenden Eigenschaften der Aufgabe
function updateTaskProperties(taskToUpdate) {
    taskToUpdate.title = document.getElementById("title-task").value || taskToUpdate.title;
    taskToUpdate.description = document.getElementById("description-task").value || taskToUpdate.description;
    taskToUpdate.dueDate = document.getElementById("date-date-task").value || taskToUpdate.date;
    taskToUpdate.heading = document.getElementById("category").value || taskToUpdate.heading;
}

// updates priority
function updatePriority(taskToUpdate) {
    const priorities = ["Urgent", "Medium", "Low"];
    priorities.forEach((priority) => {
        if (document.getElementById(priority).classList.contains("selected")) {
            taskToUpdate.priority = priority;
        }
    });
}
function saveNewPrio(clickedPrio) {
    ["Urgent", "Medium", "Low"].forEach((prio) => {
        document.getElementById(prio).classList.remove("selected");
    });
    clickedPrio.classList.add("selected");
}
// finds task and updates it
async function findTaskAndUpdate(taskId) {
    taskId = parseInt(taskId, 10);
    const taskIndex = boardTasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) {
        console.error("Task not found.");
        return;
    }
    const taskToUpdate = boardTasks[taskIndex];
    updateTaskProperties(taskToUpdate);
    updatePriority(taskToUpdate);
    if (Object.entries(currentTask).length !== 0) {
        taskToUpdate.subtasks.push(...currentTask);
    }
    // TODO ASSIGNED TO
    boardTasks[taskIndex] = taskToUpdate;
    await setItem("boardTasks", JSON.stringify(boardTasks));
    closeDialog("dialog");
    renderEachTask();
}

// test

function editAssignedToUser(task) {
    let selectField = document.getElementById("myDropdown");
    getSelectedUsers(task, selectField);
}

function getSelectedUsers(task, selectField) {
    let selectedUsers = task.sub_users;
    for (let i = 0; i < users.length; i++) {
        let user = users[i].name;
        let bgc = users[i]["bgc-name"];
        // user = generateHTMLUser();
        selectField.innerHTML += generateHTMLUser(i, bgc, user, selectedUsers);
    }
}

function generateHTMLUser(i, bgc, user,selectedUsers) {
    if(selectedUsers.length > 0){
        console.log("selectedUser if abfrage funktioniert", selectedUsers)
    }
    return ` <div class="subuser-selection" onclick="selectUser(${i})" id="subuser-div-${i}">
            <div class="subuser-align">
            <div class="sub-profile-img bgc-${bgc}">test</div>
            <div>${user}</div>
            </div>  
            <div class="checkbox"><img src="./img/checkmark-unchecked.png" alt="checkbox"
                id="checkbox-remember-me-${i}"></div>  
        </div>
    `;
}

function selectUser(i) {
    console.log("user selected:", i);
}
