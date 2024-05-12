/**
 * Displays a cancel and add (checkmark) icon if the Subtask-Input element is focused.
 */
function subtaskCustomTemplate() {
    let subtaskForm = document.getElementById("icon-hold");
    subtaskForm.innerHTML = `
      <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
      <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
      <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()"> `;
    cancelSubtaskSafety();
}

/**
 * Generates a template for a Subtask if clicked on the + (plus) icon.
 */
function subtaskTemplate() {
    let subtaskForm = document.getElementById("subtask-form");
    let subtaskValueCheck = document.getElementById("subtask");

    if (subtaskValueCheck.value == "" || subtaskValueCheck.value == null) {
        subtaskForm.innerHTML = `
        <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask" value="Contact Form">
          <div class="subtask-add-icons" id="icon-hold">
            <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()">
          </div>
        `;
    }
}

/**
 * Cancels the subtask creation if the x (cancel) icon is being clicked.
 */
function cancelSubtaskSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = document.getElementById("subtask-form");
        let subtaskInput = document.getElementById("subtask");
        if (event.target !== subtaskInput && !subtaskForm.contains(event.target) && subtaskInput.value === "") {
            cancelSubtask();
        }
    });
}

/**
 * Cancels the subtask input by re-rendering the subtask input element.
 */
function cancelSubtask() {
    let subtaskForm = document.getElementById("subtask-form");
    subtaskForm.innerHTML = `
        <input class="sub-task-child" placeholder="Add new subtask" type="text" id="subtask" onclick="subtaskCustomTemplate()">
          <div class="subtask-add-icons" id="icon-hold">
            <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="subtaskTemplate()">
        </div>
      `;
}

/**
 * Takes the subtask given input value and pushes it to the subtask array. 
 */
async function addSubtask() {
    let subtaskInputValue = document.getElementById("subtask").value.trim();
    if (subtaskInputValue !== "") {
        await subtaskInput.push(subtaskInputValue);
        const subtaskId = Date.now();
        const subtask = {
            subtaskId: subtaskId,
            subtasksText: subtaskInputValue,
            isChecked: false,
        }; await subtasks.push(subtask);
        renderSubtasks()
    };
    if (subtaskInputValue === "" || subtaskInputValue === undefined || subtaskInputValue === null) {
        cancelSubtask();
    };
    cancelSubtask();
};

/**
 * Renders the added subtask.
 */
function renderSubtasks() {
    let subtaskAdd = document.getElementById("subtask-display");
    subtaskAdd.innerHTML = "";

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskValue = subtaskInput[i] || '';
        subtaskAdd.innerHTML += `
          <span contenteditable="true" class="span-container" id="sub-span-${i}">
              <div class="subtask-preview" id="preview-${i}" onclick="subtaskFocus(${i})"><div class="list-item" id="list-item-${i}"></div><p id="sub-content-${i}">${subtaskValue}</p></div>
              <div class="subtask-icon-container" id="icon-container-${i}">
                  <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover" onclick="subtaskFocus(${i})">
                  <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
                  <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover" onclick="deleteSubtask(${i})">
              </div>
          </span> `;
    }
}

/**
 * Deletes the selected subtask.
 * @param {number} i - Index of the subtask to be deleted.
 */
function deleteSubtask(i) {
    subtaskInput.splice(i, 1);
    subtasks.splice(i, 1);
    let subtaskSpan = document.getElementById(`sub-span-${i}`);
    if (subtaskSpan) {
        subtaskSpan.remove();
    }
    for (let j = i; j < subtasks.length; j++) {
        renderSubtaskSafety(j)
    }
    renderSubtasks();
}

/**
 * Adjusts IDs and classes after a subtask is deleted to maintain consistency.
 * @param {number} j - Index of the subtask.
 */
function renderSubtaskSafety(j) {
    let span = document.getElementById(`sub-span-${j + 1}`);
    let preview = document.getElementById(`preview-${j + 1}`);
    let iconContainer = document.getElementById(`icon-container-${j + 1}`);
    if (span) {
        span.id = `sub-span-${j}`;
    } if (preview) {
        preview.id = `preview-${j}`;
    } if (iconContainer) {
        iconContainer.id = `icon-container-${j}`;
    }
}

/**
 * Renders extra icon options to delete the subtask while being focused on the subtask and / or get out of focus from the subtask. 
 * @param {number} i - Index of the focused subtask. 
 */
function subtaskFocus(i) {
    let subTaskSpan = document.getElementById(`sub-span-${i}`);
    let listItem = document.getElementById(`list-item-${i}`);
    let preview = document.getElementById(`preview-${i}`);
    let editIcon = document.getElementById(`icon-container-${i}`);

    subTaskSpan.classList.add("focus-input");
    listItem.classList.add("focus-list-item");
    preview.classList.add("focus-preview");

    editIcon.innerHTML = `
        <img src="./img/delete.png" alt="delete-icon" id="first-icon" class="hover" onclick="deleteSubtask(${i})">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
        <img src="./img/done.png" alt="done-icon" id="third-icon" class="hover" onclick="subtaskOutOfFocus(${i})">
      `;
}

/**
 * Reverts the subtaskFocus() changes by removing the added classes and re-rendering the subtask element.
 * @param {number} i - Index of the focused subtask. 
 */
function subtaskOutOfFocus(i) {
    let subtaskInputValue = document.getElementById(`sub-content-${i}`).innerText;
    let subtaskIndexValue = subtasks[i]["subtasksText"];

    if (subtaskInputValue !== subtaskIndexValue) {
        subtasks[i]["subtasksText"] = subtaskInputValue;
    }
    document.getElementById(`sub-span-${i}`).classList.remove("focus-input");
    document.getElementById(`list-item-${i}`).classList.remove("focus-list-item");
    document.getElementById(`preview-${i}`).classList.remove("focus-preview");
    let editIcon = document.getElementById(`icon-container-${i}`);

    editIcon.innerHTML = `
        <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover" onclick="subtaskFocus(${i})">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
        <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover" onclick="deleteSubtask(${i})"> `;
}

/**
 * Handles which priority is clicked.
 * @param {HTMLElement} clickedPrio - The priority element clicked.
 */
function prioSelection(clickedPrio) {
    let prio = clickedPrio;
    let lowImg = document.getElementById("low-img");
    let mediumImg = document.getElementById("medium-img");
    let urgentImg = document.getElementById("urgent-img");

    document.getElementById("Urgent").classList.remove("prioUrgent");
    document.getElementById("Medium").classList.remove("prioMedium");
    document.getElementById("Low").classList.remove("prioLow");

    lowImg.src = "./img/low.png";
    mediumImg.src = "./img/medium-prio.png";
    urgentImg.src = "./img/urgent-red-arrows.png";

    prioDecision(prio, lowImg, mediumImg, urgentImg);
}

/**
 * Resets the non selected priority elements.
 * @param {HTMLElement} prio - The priority element selected.
 * @param {HTMLElement} lowImg - The low priority image element.
 * @param {HTMLElement} mediumImg - The medium priority image element.
 * @param {HTMLElement} urgentImg - The urgent priority image element.
 */
function prioDecision(prio, lowImg, mediumImg, urgentImg) {
    if (prio.id === "Urgent") {
        prio.classList.add("prioUrgent");
        urgentImg.src = "./img/urgent-white-arrows.png";
    } else if (prio.id === "Medium") {
        prio.classList.add("prioMedium");
        mediumImg.src = "./img/medium.png";
    } else if (prio.id === "Low") {
        prio.classList.add("prioLow");
        lowImg.src = "./img/low-white-arrows.png";
    }

    priority = prio.id;
}

/**
 * 
 * @param {HTMLElement} clickedCategory - The category which was clicked on.
 */
function selectCategory(clickedCategory) {
    let cat = clickedCategory;
    let categoryContainer = document.getElementById('chosen-task');
    heading = cat.id;

    categoryContainer.innerHTML = `${heading}`;
    flipDropDownMenuCategory(false);
}

/**
 * Clears the input field of subtasks when a task has been added.
 */
function clearAddTask() {
    document.getElementById("title-task").value = "";
    document.getElementById("description-task").value = "";
    document.getElementById("date-date-task").value = "";
    document.getElementById("chosen-task").innerHTML = "Select task category";
    document.getElementById("sub-profile").innerHTML = "";
    document.getElementById("subtask-display").innerHTML = "";

    let subProfile = document.getElementById("sub-profile");
    subProfile.innerHTML = "";
    clearArrays();
    assignedTo();
    prioSelection(Medium);
}

/**
 * Clears / Resets all global arrays.
 */
function clearArrays() {
    subtaskInput = [];
    subtasks = [];
    sub_users = [];
    contactsUser = [];
    priority = priorityDefault;
}

/**
 * Enables a "Task added to board" animation and redirects the user to the board.html after successfully adding a task.
 */
function addedTask() {
    if (!document.getElementById("title-task").value == "" || !document.getElementById("date-date-task").value == "" || !heading == "") {
        let backLog = document.getElementById('task-added-success');
        backLog.classList.remove('d-none')
        setTimeout(function () {
            window.location.href = "board.html";
        }, 1500);
    }
}

const scrollContainer = document.getElementById("sub-profile");

/**
 * Enables vertical scrolling if the sub-profile elements content is overflowing.
 */
scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});