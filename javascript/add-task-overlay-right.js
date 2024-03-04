/**
 * Provides the subtask input's icons.
 */
function subtaskCustomTemplate() {
    let subtaskForm = getElement('icon-hold-overlay');
    subtaskForm.innerHTML = `
        <img src="./img/cancel.png" alt="cancel-icon" class="hover-overlay" onclick="cancelSubtask()">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/done.png" alt="add-icon" class="hover-overlay" onclick="addSubtask()">
    `;
    cancelSubtaskSafety();
}


/**
 * Provides the subtask input's default settings.
 */
function subtaskTemplate() {
    let subtaskForm = getElement('subtask-form-overlay');
    let subtaskValueCheck = getElement('subtask-overlay');
    if (subtaskValueCheck.value == "" || subtaskValueCheck.value == null) {
        subtaskForm.innerHTML = `
            <input class="sub-task-child-overlay" required placeholder="Add new subtask" type="text" id="subtask-overlay" value="Contact Form">
            <div class="subtask-add-icons-overlay" id="icon-hold-overlay">
                <img src="./img/cancel.png" alt="cancel-icon" class="hover-overlay" onclick="cancelSubtask()">
                <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
                <img src="./img/done.png" alt="add-icon" class="hover-overlay" onclick="addSubtask()">
            </div>
        `;
    }
}


/**
 * Cancels an entered subtask.
 */
function cancelSubtask() {
    let subtaskForm = getElement("subtask-form-overlay");
    subtaskForm.innerHTML = `
        <input class="sub-task-child-overlay" placeholder="Add new subtask" type="text" id="subtask-overlay" onclick="subtaskCustomTemplate()">
        <div class="subtask-add-icons-overlay" id="icon-hold-overlay">
            <img src="./img/subtask.png" alt="add-icon" class="hover-overlay add-hover-overlay" onclick="subtaskTemplate()">
        </div>
    `;
}


/**
 * Cancels the subtask safety.
 */
function cancelSubtaskSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = getElement('subtask-form-overlay');
        let subtaskInput = getElement('subtask-overlay');
        if (event.target !== subtaskInput && !subtaskForm.contains(event.target) && subtaskInput.value === "") {
            cancelSubtask();
        }
    });
}


/**
 * Adds a new subtask.
 */
async function addSubtask() {
    let subtaskAdd = getElement('subtask-display-overlay');
    let subtaskInputValue = getElement('subtask-overlay').value.trim();
    subtaskAdd.innerHTML = "";
    if (subtaskInputValue !== "") {
        await subtaskInput.push(subtaskInputValue);
        const subtaskId = Date.now();
        const subtask = getSubtask(subtaskId, subtaskInputValue);
        subtasks.push(subtask);
        renderSubtasks(subtaskAdd, subtaskInput);
    }
    cancelSubtask();
}


/**
 * Provides a new subtask object.
 * @param {number} subtaskId - The new subtask's id.
 * @param {value} subtaskInputValue - The new subtask's input value.
 * @returns - The new subtask object.
 */
function getSubtask(subtaskId, subtaskInputValue) {
    return {
        subtaskId: subtaskId,
        subtasksText: subtaskInputValue,
        isChecked: false,
    };
}


/**
 * Renders the subtasks.
 * @param {element} subtaskAdd - The receiving element.
 * @param {value} subtaskInput - The subtasks' input value.
 */
function renderSubtasks(subtaskAdd, subtaskInput) {
    for (let i = 0; i < subtaskInput.length; i++) {
        subtaskAdd.innerHTML += `
            <span contenteditable="true" class="span-container-overlay" id="sub-span-${i}">
            <div class="subtask-preview-overlay" id="preview-${i}" onclick="setSubtaskFocus(${i}, true)"><div class="list-item-overlay" id="list-item-${i}"></div><p id="sub-content-${i}">${subtaskInput[i]}</p></div>
            <div class="subtask-icon-container-overlay" id="icon-container-${i}">
                <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover-overlay" onclick="setSubtaskFocus(${i}, true)">
                <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
                <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
            </div>
            </span>
        `;
    }
}


/**
 * Deletes a subtask.
 * @param {number} i - The subtask's id to delete. 
 */
function deleteSubtask(i) {
    subtaskInput.splice(i, 1);
    let subtaskSpan = getElement(`sub-span-${i}`);
    if (subtaskSpan) {
        subtasks.splice(i);
        subtaskSpan.remove();
    }
}


/**
 * Sets a subtask's focus.
 * @param {number} i - The subtask's id to focus.
 * @param {Boolean} logical - True or false.
 */
function setSubtaskFocus(i, logical) {
    let subfunction = (logical) ? addClass : removeClass;
    setClass(`sub-span-${i}`, subfunction, 'focus-input-overlay');
    setClass(`list-item-${i}`, subfunction, 'focus-list-item-overlay');
    setClass(`preview-${i}`, subfunction, 'focus-preview-overlay');
    renderEditIcon(true);
}


/**
 * Renders the subtask's edit icon.
 * @param {Boolean} logical - True or false.
 */
function renderEditIcon(logical) {
    let editIcon = getElement(`icon-container-${i}`);
    (logical) ? renderEditIconTypeA(editIcon) : renderEditIconTypeB(editIcon);
}


/**
 * Renders the subtask's edit icon (type A).
 * @param {element} editIcon - The receiving element.
 */
function renderEditIconTypeA(editIcon) {
    editIcon.innerHTML = `
        <img src="./img/delete.png" alt="delete-icon" id="first-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/done.png" alt="done-icon" id="third-icon" class="hover-overlay" onclick="subtaskOutOfFocus(${i})">
    `;
}


/**
 * Renders the subtask's edit icon (type B).
 * @param {element} editIcon - The receiving element.
 */
function renderEditIconTypeB(editIcon) {
    editIcon.innerHTML = `
        <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover-overlay" onclick="setSubtaskFocus(${i}, true)">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
    `;
}


/**
 * Defocus a subtask.
 * @param {number} i - The subtask's id to defocus.
 */
function subtaskOutOfFocus(i) {
    let subtaskInputValue = getElement(`sub-content-${i}`).innerText;
    let subtaskIndexValue = subtasks[i]["subtasksText"];
    if (subtaskInputValue !== subtaskIndexValue) {
        subtasks[i]["subtasksText"] = subtaskInputValue;
    }
    setSubtaskFocus(i, false);
    renderEditIcon(false);
}


/**
 * Sets the selected priority.
 * @param {element} clickedPrio - The clicked element's id.
 * @param {Boolean} overlay - True or false.
 */
function prioSelection(clickedPrio, overlay) {
    let prio = clickedPrio.id;
    priority = prio;
    (!overlay) ? resetPrioImg() : resetPrioImg(true);
    (!overlay) ? resetPrioClass() : resetPrioClass(true);
    (!overlay) ? setPrioButton(prio) : setPrioButton(prio, true);
}


/**
 * Resets a priority button's image.
 * @param {Boolean} overlay - True or false.
 */
function resetPrioImg(overlay) {
    (!overlay) ? setElementAttribute(`urgent-img`, 'src', './img/urgent-red-arrows.png') : setElementAttribute(`urgent-img-overlay`, 'src', './img/urgent-red-arrows.png');
    (!overlay) ? setElementAttribute(`medium-img`, 'src', './img/medium-prio.png') : setElementAttribute(`medium-img-overlay`, 'src', './img/medium-prio.png');
    (!overlay) ? setElementAttribute(`low-img`, 'src', './img/low.png') : setElementAttribute(`low-img-overlay`, 'src', './img/low.png');
}


/**
 * Resets a priority buttons classes.
 * @param {Boolean} overlay - True or false.
 */
function resetPrioClass(overlay) {
    (!overlay) ? setClass('Urgent', removeClass, 'prioUrgent') : setClass('urgent-overlay', removeClass, 'prioUrgent');
    (!overlay) ? setClass('Medium', removeClass, 'prioMedium') : setClass('medium-overlay', removeClass, 'prioMedium');
    (!overlay) ? setClass('Low', removeClass, 'prioLow') : setClass('low-overlay', removeClass, 'prioLow');
}


/**
 * Sets a priority buttons settings.
 * @param {String} prio - The clicked element's id.
 * @param {Boolean} overlay - True or false.
 */
function setPrioButton(prio, overlay) {
    if (prio === 'Urgent' || prio === 'urgent-overlay') {
        setClass(prio, addClass, 'prioUrgent');
        (!overlay) ? setElementAttribute('urgent-img', 'src', './img/urgent-white-arrows.png') : setElementAttribute('urgent-img-overlay', 'src', './img/urgent-white-arrows.png');
    } else if (prio === 'Medium' || prio === 'medium-overlay') {
        setClass(prio, addClass, 'prioMedium');
        (!overlay) ? setElementAttribute('medium-img', 'src', './img/medium.png') : setElementAttribute('medium-img-overlay', 'src', './img/medium.png');
    } else if (prio === 'Low' || prio === 'low-overlay') {
        setClass(prio, addClass, 'prioLow');
        (!overlay) ? setElementAttribute('low-img', 'src', './img/low-white-arrows.png') : setElementAttribute('low-img-overlay', 'src', './img/low-white-arrows.png');
    }
}


/**
 * Clears the add task form.
 */
function clearAddTask() {
    resetAddTaskFormData();
    resetAddTaskGlobalVariables();
    assignedTo();
    prioSelection(getElement('medium-overlay'), true);
    flipDropDownMenu(false, false, true);
    flipDropDownMenu(false, true, true);
    setClass('dropdown-parent-category-overlay', removeClass, 'dropdown-parent-container-wrong-overlay');
}


/**
 * Resets the add task form's data.
 */
function resetAddTaskFormData() {
    resetElementData('title-task-overlay', 'value');
    resetElementData('description-task-overlay', 'value');
    resetElementData('date-date-task-overlay', 'value');
    resetElementData('chosen-task-overlay', 'innerHTML', 'Select task category');
    resetElementData('sub-profile-overlay', 'value');
    resetElementData('subtask-display-overlay', 'innerHTML');
    resetElementData('sub-profile-overlay', 'innerHTML');
}


/**
 * Resets an element's data.
 * @param {String} id - The element's id to reset.
 * @param {String} type - The type of value to reset.
 * @param {value} value - The default value.
 */
function resetElementData(id, type, value) {
    let element = getElement(id);
    value = (!value) ? '' : value;
    (type != 'value') ? element.innerHTML = value : element.value = value;
}


/**
 * Resets the global variables of the add task page.
 */
function resetAddTaskGlobalVariables() {
    subtaskInput = [];
    subtasks = [];
    sub_users = [];
    contactsUser = [];
    priority = priorityDefault;
}


/**
 * Gives a user feedback after creating a new task.
 */
function addedTask() {
    setClass('task-added-success-overlay', removeClass, 'd-none-overlay');
    setTimeout(function () {
        closeAddTaskOverlay();
        boardInit();
    }, 1000);
}


/**
 * Selects the clicked drop-down category.
 * @param {element} clickedCategory - The clicked element.
 */
function selectCategory(clickedCategory) {
    heading = clickedCategory.id;
    let categoryContainer = getElement('chosen-task-overlay');
    categoryContainer.innerHTML = `${heading}`;
    flipDropDownMenu(false, true, true);
    setClass('dropdown-parent-category-overlay', removeClass, 'dropdown-parent-container-wrong-overlay');
}


/**
 * Opens the add task overlay.
 */
async function openAddTaskOverlay() {
    let bodyWidth = getElement('body').offsetWidth;
    if (bodyWidth > 730) {
        addTaskInit();
        openDialog('add-task-overlay');
        setClass('add-task-overlay-position', addClass, 'add-task-overlay-in');
    } else {
        window.location.href = './add-task.html';
    }
}


/**
 * Closes the add task overlay.
 */
async function closeAddTaskOverlay() {
    setClass('add-task-overlay-position', removeClass, 'add-task-overlay-in');
    setTimeout(() => {
        closeDialog('add-task-overlay');
        clearAddTask();
    }, 100);
}