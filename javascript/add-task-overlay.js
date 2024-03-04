let subtaskInput = [];
let priorityDefault = "medium-overlay";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;


/**
 * Initializes the add task overlay.
 */
async function addTaskInit() {
    await loadTasks();
    await loadUsers();
    assignedTo();
}


/**
 * Loads the tasks of the board.
 */
async function loadTasks() {
    try {
        boardTasks = JSON.parse(await getItem("boardTasks"));
    } catch (error) {
        console.log(error);
    }
}


/**
 * Scopes the entered tasks.
 */
async function scopeTasks() {
    if (verifyAddTaskInput()) {
        let title = getInputValue('title-task-overlay');
        let description = getInputValue('description-task-overlay');
        let dueDate = getInputValue('date-date-task-overlay');
        let category = getElement('chosen-task-overlay').innerHTML;
        let priorityName = getPriorityName(priority);
        const taskId = Date.now();
        let taskParameter = [taskId, title, description, dueDate, priorityName, category];
        createNewTask(taskParameter);
    }
}


/**
 * Verifies the entered task's input values.
 * @returns - True or false.
 */
function verifyAddTaskInput() {
    let title = getInputValue('title-task-overlay');
    let dueDate = getInputValue('date-date-task-overlay');
    let category = getElement('chosen-task-overlay').innerHTML;
    let formInputValid = (title != '' && dueDate != '' && category != 'Select task category') ? true : false;
    (category == 'Select task category') ? setClass('dropdown-parent-category-overlay', addClass, 'dropdown-parent-container-wrong-overlay') : false;
    return formInputValid;
}


/**
 * Provides a priority's related id.
 * @param {String} priority - The priority's coding id.
 * @returns - A priority's related id.
 */
function getPriorityName(priority) {
    let priorityName = priority.split('-');
    priorityName = priorityName[0];
    priorityName = priorityName.replace(priorityName[0], priorityName[0].toUpperCase());
    return priorityName;
}


/**
 * Creates a new task.
 * @param {array} taskParameter - Provides some values for the new task.
 */
function createNewTask(taskParameter) {
    let task = {
        taskId: taskParameter[0],
        title: taskParameter[1],
        description: taskParameter[2],
        category: "toDo",
        heading: taskParameter[5],
        subtasks: subtasks,
        sub_users: sub_users,
        priority: taskParameter[4],
        dueDate: taskParameter[3]
    };
    updateBoardTasks(task);
}


/**
 * Updates the board's tasks.
 * @param {object} task - The new created task's object.
 */
async function updateBoardTasks(task) {
    boardTasks.push(task);
    await setItem("boardTasks", JSON.stringify(boardTasks));
    addedTask();
}


/**
 * Renders the drop-down menu 'assigned to'.
 */
function assignedTo() {
    let assignElement = document.getElementById('myDropdown-overlay');
    assignElement.innerHTML = '';
    fillSelectAssignedTo(assignElement);
}


/**
 * Fills the drop-down menu 'assigned-to'.
 * @param {element} assignElement - The element to fill.
 */
function fillSelectAssignedTo(assignElement) {
    for (let i = 0; i < users.length; i++) {
        const bgc = `bgc-${users[i]["bgc-name"]}`;
        const contact = users[i].name;
        let letterGroup = userInitials(contact);
        assignElement.innerHTML += `
            <div class="subuser-selection-overlay" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
                <div class="subuser-align-overlay"><div class="sub-profile-img-overlay ${bgc}">${letterGroup}</div><div>${contact}</div></div>  
                <div class="checkbox-overlay"><img src="./img/checkmark-unchecked.png" alt="checkbox" id="checkbox-remember-me-${i}"></div>  
            </div>
        `;
    }
}


/**
 * Flips the drop-down menu.
 * @param {Boolean} dropDown - True or false.
 * @param {Boolean} extCategory - True or false.
 * @param {Boolean} extOverlay - True or false.
 */
function flipDropDownMenu(dropDown, extCategory, extOverlay) {
    let category = (!extCategory) ? '' : '-category';
    let overlay = (!extOverlay) ? '' : '-overlay';
    setDropDownIcon(dropDown, category, overlay);
    setDropDownClasses(dropDown, category, overlay);
    updateDropDownOnclick(dropDown, category, overlay);
}


/**
 * Sets the drop-down menu's icon.
 * @param {Boolean} dropDown - True or false.
 * @param {String} category - Elements' id extension.
 * @param {String} overlay - Elements' id extension.
 */
function setDropDownIcon(dropDown, category, overlay) {
    let icon = getElement('drop-down-icon' + category + overlay);
    icon.src = (dropDown) ? './img/arrow_drop_down-up.png' : './img/arrow_drop_downaa.png';
}


/**
 * Sets the drop-down menu's classes.
 * @param {Boolean} dropDown - True or false.
 * @param {String} category - Elements' id extension.
 * @param {String} overlay - Elements' id extension.
 */
function setDropDownClasses(dropDown, category, overlay) {
    let subfunction = (dropDown) ? addClass : removeClass;
    setClass('myDropdown' + category + overlay, subfunction, 'show' + overlay);
    setClass('dropdown-parent' + category + overlay, subfunction, 'dropdown-outline-focus' + overlay);
    setClass('dropdown-parent' + category + overlay, subfunction, 'dropdown-custom' + overlay);
}


/**
 * Updates the drop-down menu by click.
 * @param {Booelan} dropDown - True or false.
 * @param {String} category - Elements' id extension.
 * @param {String} overlay - Elements' id extension.
 */
function updateDropDownOnclick(dropDown, category, overlay) {
    let isCategory = (category != '') ? true : false;
    let isOverlay = (overlay != '') ? true : false;
    let extOverlay = (isOverlay) ? ', true' : '';
    let closeOtherMenu = (!dropDown && isOverlay) ? `flipDropDownMenu(false, ${!isCategory}${extOverlay})` : '';
    nextFunction = (!overlay) ? `flipDropDownMenu(${!dropDown}, ${isCategory}); ${closeOtherMenu}` : `flipDropDownMenu(${!dropDown}, ${isCategory}, true); ${closeOtherMenu}`;
    setElementAttribute('dropdown-parent' + category + overlay, 'onclick', nextFunction);
}


/**
 * Toggles a checkbox.
 * @param {number} i - The id of the checkbox.
 */
function toggleCheckbox(i) {
    let checkBox = getElement(`checkbox-remember-me-${i}`);
    let unchecked = checkBox.src.includes('checkmark-unchecked.png');
    (unchecked) ? setCheckBox(i, true) : setCheckBox(i, false);
}


/**
 * Applies the checkbox settings.
 * @param {number} i - The id of the checkbox.
 * @param {Boolean} logical - True or false.
 */
function setCheckBox(i, logical) {
    setCheckBoxBackground(i, logical);
    setCheckBoxImage(i, logical);
    (logical) ? pushAssignedSubuser(i) : spliceAssignedSubuser(i);
    renderAssigendSubuser();
}


/**
 * Sets the background color of a checkbox.
 * @param {number} i - The id of the checkbox.
 * @param {Boolean} logical - True or false.
 */
function setCheckBoxBackground(i, logical) {
    let subfunction = (logical) ? addClass : removeClass;
    setClass(`subuser-div-${i}`, subfunction, 'sub-background-overlay');
}


/**
 * Sets the image of a checkbox.
 * @param {number} i - The id of the checkbox.
 * @param {Boolean} logical - True or false.
 */
function setCheckBoxImage(i, logical) {
    let checkmark = (logical) ? './img/checkmark-white.png' : './img/checkmark-unchecked.png';
    let checkBox = getElement(`checkbox-remember-me-${i}`);
    checkBox.src = checkmark;
}


/**
 * Pushes a assignable subuser to the array sub_users.
 * @param {number} i - The assignable subuser's id.
 */
function pushAssignedSubuser(i) {
    let subuserTemp = users[i];
    let subUserIdTemp = users[i]["userId"];
    sub_users.push(
        {
            userIdIterate: i,
            userId: subUserIdTemp,
            name: subuserTemp.name,
            "bgc-name": subuserTemp["bgc-name"]
        }
    );
}


/**
 * Removes a assigned subuser from the array sub_users.
 * @param {number} i - The id of the subuser to remove.
 */
function spliceAssignedSubuser(i) {
    let subuser = sub_users.findIndex(u => u.userIdIterate == i);
    sub_users.splice(subuser, 1);
}


function renderAssigendSubuser() {
    let subProfile = getElement("sub-profile-overlay");
    subProfile.innerHTML = '';
    for (let j = 0; j < sub_users.length; j++) {
        let subBgc = "bgc-" + sub_users[j]['bgc-name'];
        let contactId = sub_users[j]["userIdIterate"];
        let subProfileName = sub_users[j].name;
        let letterGroup = userInitials(subProfileName);
        subProfile.innerHTML += `
        <div class="sub-profile-img-overlay sub-p-overlay ${subBgc}" id="contact-id-${contactId}"onclick="removeSubPB(${contactId})">${letterGroup}</div>
      `;
    }
}


function removeSubPB(subuserId) {
    spliceAssignedSubuser(subuserId);
    renderSubProfiles(subuserId);
}


function renderSubProfiles(i) {
    setElementAttribute(`checkbox-remember-me-${i}`, 'src', './img/checkmark-unchecked.png');
    setClass(`subuser-div-${i}`, removeClass, 'sub-background-overlay');
    getElement(`contact-id-${i}`).remove();
}


function subtaskCustomTemplate() {
    let subtaskForm = getElement('icon-hold-overlay');
    subtaskForm.innerHTML = `
        <img src="./img/cancel.png" alt="cancel-icon" class="hover-overlay" onclick="cancelSubtask()">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/done.png" alt="add-icon" class="hover-overlay" onclick="addSubtask()">
    `;
    cancelSubtaskSafety();
}


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


function cancelSubtask() {
    let subtaskForm = document.getElementById("subtask-form-overlay");
    subtaskForm.innerHTML = `
        <input class="sub-task-child-overlay" placeholder="Add new subtask" type="text" id="subtask-overlay" onclick="subtaskCustomTemplate()">
        <div class="subtask-add-icons-overlay" id="icon-hold-overlay">
            <img src="./img/subtask.png" alt="add-icon" class="hover-overlay add-hover-overlay" onclick="subtaskTemplate()">
        </div>
    `;
}


function cancelSubtaskSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = getElement('subtask-form-overlay');
        let subtaskInput = getElement('subtask-overlay');
        if (
            event.target !== subtaskInput &&
            !subtaskForm.contains(event.target) &&
            subtaskInput.value === ""
        ) {
            cancelSubtask();
        }
    });
}


async function addSubtask() {
    let subtaskAdd = getElement('subtask-display-overlay');
    let subtaskInputValue = getElement('subtask-overlay').value.trim();
    subtaskAdd.innerHTML = "";
    if (subtaskInputValue !== "") {
        await subtaskInput.push(subtaskInputValue);
        const subtaskId = Date.now();
        const subtask = getSubtask(subtaskId, subtaskInputValue)
        subtasks.push(subtask);
        renderSubtasks(subtaskAdd, subtaskInput);
    }
    cancelSubtask();
}


function getSubtask(subtaskId, subtaskInputValue) {
    return {
        subtaskId: subtaskId,
        subtasksText: subtaskInputValue,
        isChecked: false,
    };
}


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


function deleteSubtask(i) {
    subtaskInput.splice(i, 1);
    let subtaskSpan = getElement(`sub-span-${i}`);
    if (subtaskSpan) {
        subtasks.splice(i);
        subtaskSpan.remove();
    }
}


function setSubtaskFocus(i, logical) {
    let subfunction = (logical) ? addClass : removeClass;
    setClass(`sub-span-${i}`, subfunction, 'focus-input-overlay');
    setClass(`list-item-${i}`, subfunction, 'focus-list-item-overlay');
    setClass(`preview-${i}`, subfunction, 'focus-preview-overlay');
    renderEditIcon(true);
}


function renderEditIcon(logical) {
    let editIcon = getElement(`icon-container-${i}`);
    (logical) ? renderEditIconTypeA(editIcon) : renderEditIconTypeB(editIcon);
}


function renderEditIconTypeA(editIcon) {
    editIcon.innerHTML = `
        <img src="./img/delete.png" alt="delete-icon" id="first-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/done.png" alt="done-icon" id="third-icon" class="hover-overlay" onclick="subtaskOutOfFocus(${i})">
    `;
}


function renderEditIconTypeB(editIcon) {
    editIcon.innerHTML = `
        <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover-overlay" onclick="setSubtaskFocus(${i}, true)">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
    `;
}


function subtaskOutOfFocus(i) {
    let subtaskInputValue = getElement(`sub-content-${i}`).innerText;
    let subtaskIndexValue = subtasks[i]["subtasksText"];
    if (subtaskInputValue !== subtaskIndexValue) {
        subtasks[i]["subtasksText"] = subtaskInputValue;
    }
    setSubtaskFocus(i, false);
    renderEditIcon(false);
}


function prioSelection(clickedPrio, overlay) {
    let prio = clickedPrio.id;
    priority = prio;
    (!overlay) ? resetPrioImg() : resetPrioImg(true);
    (!overlay) ? resetPrioClass() : resetPrioClass(true);
    (!overlay) ? setPrioButton(prio) : setPrioButton(prio, true);
}


function resetPrioImg(overlay) {
    (!overlay) ? setElementAttribute(`urgent-img`, 'src', './img/urgent-red-arrows.png') : setElementAttribute(`urgent-img-overlay`, 'src', './img/urgent-red-arrows.png');
    (!overlay) ? setElementAttribute(`medium-img`, 'src', './img/medium-prio.png') : setElementAttribute(`medium-img-overlay`, 'src', './img/medium-prio.png');
    (!overlay) ? setElementAttribute(`low-img`, 'src', './img/low.png') : setElementAttribute(`low-img-overlay`, 'src', './img/low.png');
}


function resetPrioClass(overlay) {
    (!overlay) ? setClass('Urgent', removeClass, 'prioUrgent') : setClass('urgent-overlay', removeClass, 'prioUrgent');
    (!overlay) ? setClass('Medium', removeClass, 'prioMedium') : setClass('medium-overlay', removeClass, 'prioMedium');
    (!overlay) ? setClass('Low', removeClass, 'prioLow') : setClass('low-overlay', removeClass, 'prioLow');
}


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


function clearAddTask() {
    resetAddTaskFormData();
    resetAddTaskGlobalVariables();
    assignedTo();
    prioSelection(getElement('medium-overlay'), true);
    flipDropDownMenu(false, false, true);
    flipDropDownMenu(false, true, true);
    setClass('dropdown-parent-category-overlay', removeClass, 'dropdown-parent-container-wrong-overlay');
}


function resetAddTaskFormData() {
    resetElementData('title-task-overlay', 'value');
    resetElementData('description-task-overlay', 'value');
    resetElementData('date-date-task-overlay', 'value');
    resetElementData('chosen-task-overlay', 'innerHTML', 'Select task category');
    resetElementData('sub-profile-overlay', 'value');
    resetElementData('subtask-display-overlay', 'innerHTML');
    resetElementData('sub-profile-overlay', 'innerHTML');
}


function resetElementData(id, type, value) {
    let element = getElement(id);
    value = (!value) ? '' : value;
    (type != 'value') ? element.innerHTML = value : element.value = value;
    console.log('delete data');
}


function resetAddTaskGlobalVariables() {
    subtaskInput = [];
    subtasks = [];
    sub_users = [];
    contactsUser = [];
    priority = priorityDefault;
}


function addedTask() {
    setClass('task-added-success-overlay', removeClass, 'd-none-overlay');
    setTimeout(function () {
        closeAddTaskOverlay();
        boardInit();
        // window.location.href = "./board.html";
    }, 1000);
}


function selectCategory(clickedCategory) {
    heading = clickedCategory.id;
    let categoryContainer = getElement('chosen-task-overlay');
    categoryContainer.innerHTML = `${heading}`;
    flipDropDownMenu(false, true, true);
    setClass('dropdown-parent-category-overlay', removeClass, 'dropdown-parent-container-wrong-overlay');
}


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


async function closeAddTaskOverlay() {
    setClass('add-task-overlay-position', removeClass, 'add-task-overlay-in');
    setTimeout(() => {
        closeDialog('add-task-overlay');
        clearAddTask();
    }, 100);
}