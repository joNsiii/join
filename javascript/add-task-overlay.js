let subtaskInput = [];
let priorityDefault = "medium-overlay";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;


async function addTaskInit() {
    await loadTasks();
    await loadUsers();
    assignedTo();
}


async function loadTasks() {
    try {
        boardTasks = JSON.parse(await getItem("boardTasks"));
    } catch (error) {
        console.log(error);
    }
}


function reloadPage() {
    location.reload();
}


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


function verifyAddTaskInput() {
    let title = getInputValue('title-task-overlay');
    let dueDate = getInputValue('date-date-task-overlay');
    let category = getElement('chosen-task-overlay').innerHTML;
    let formInputValid = (title != '' && dueDate != '' && category != 'Select task category') ? true : false;
    setClass('dropdown-parent-category-overlay', addClass, 'dropdown-parent-container-wrong-overlay');
    return formInputValid;
}


function getPriorityName(priority) {
    let priorityName = priority.split('-');
    priorityName = priorityName[0];
    priorityName = priorityName.replace(priorityName[0], priorityName[0].toUpperCase());
    return priorityName;
}


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


async function updateBoardTasks(task) {
    boardTasks.push(task);
    await setItem("boardTasks", JSON.stringify(boardTasks));
    addedTask();
}


function assignedTo() {
    let assignElement = document.getElementById("myDropdown-overlay");
    assignElement.innerHTML = "";
    fillSelectAssignedTo(assignElement);
}


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


function flipDropDownMenu(dropDown, extension) {
    let overlay = (!extension) ? '' : '-overlay';
    setDropDownIcon(dropDown, overlay);
    setDropDownClasses(dropDown, overlay);
    updateDropDownOnclick(dropDown, extension, overlay);
}


function setDropDownIcon(dropDown, overlay) {
    let icon = getElement('drop-down-icon' + overlay);
    icon.src = (dropDown) ? './img/arrow_drop_down-up.png' : './img/arrow_drop_downaa.png';
}


function setDropDownClasses(dropDown, overlay) {
    let subfunction = (dropDown) ? addClass : removeClass;
    setClass('myDropdown' + overlay, subfunction, 'show' + overlay);
    setClass('dropdown-parent' + overlay, subfunction, 'dropdown-outline-focus' + overlay);
    setClass('dropdown-parent' + overlay, subfunction, 'dropdown-custom' + overlay);
}


function updateDropDownOnclick(dropDown, extension, overlay) {
    let closeOtherMenu = (!dropDown && extension) ? 'flipDropDownMenuCategory(false, true)' : '';
    nextFunction = (!extension) ? `flipDropDownMenu(${!dropDown}); ${closeOtherMenu}` : `flipDropDownMenu(${!dropDown}, ${extension}); ${closeOtherMenu}`;
    setElementAttribute('dropdown-parent' + overlay, 'onclick', nextFunction);
}


function toggleCheckbox(i) {
    let checkBox = getElement(`checkbox-remember-me-${i}`);
    let unchecked = checkBox.src.includes('checkmark-unchecked.png');
    (unchecked) ? setCheckBox(i, true) : setCheckBox(i, false);
}


function setCheckBox(i, logical) {
    setCheckBoxBackground(i, logical);
    setCheckBoxImage(i, logical);
    (logical) ? pushAssignedSubuser(i) : spliceAssignedSubuser(i);
    renderAssigendSubuser();
}


function setCheckBoxBackground(i, logical) {
    let subfunction = (logical) ? addClass : removeClass;
    setClass(`subuser-div-${i}`, subfunction, 'sub-background-overlay');
}


function setCheckBoxImage(i, logical) {
    let checkmark = (logical) ? './img/checkmark-white.png' : './img/checkmark-unchecked.png';
    let checkBox = getElement(`checkbox-remember-me-${i}`);
    checkBox.src = checkmark;
}


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
    let indexToRemove = sub_users.findIndex((user) => user.userIdIterate === subuserId);
    if (indexToRemove !== -1) {
        sub_users.splice(indexToRemove, 1);
        renderSubProfiles(subuserId);
    }
}


function renderSubProfiles(i) {
    setElementAttribute(`checkbox-remember-me-${i}`, 'src', './img/checkmark-unchecked.png');
    setClass(`subuser-div-${i}`, removeClass, 'sub-background-overlay');
    getElement(`contact-id-${i}`).remove();
}


function subtaskCustomTemplate() {
    let subtaskForm = document.getElementById("icon-hold-overlay");
    let subtaskValueCheck = document.getElementById("subtask-overlay");

    subtaskForm.innerHTML = `
        <img src="./img/cancel.png" alt="cancel-icon" class="hover-overlay" onclick="cancelSubtask()">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
        <img src="./img/done.png" alt="add-icon" class="hover-overlay" onclick="addSubtask()">
      `;
    cancelSubtaskSafety();
}

function subtaskTemplate() {
    let subtaskForm = document.getElementById("subtask-form-overlay");
    let subtaskValueCheck = document.getElementById("subtask-overlay");

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
        let subtaskForm = document.getElementById("subtask-form-overlay");
        let subtaskInput = document.getElementById("subtask-overlay");

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
    let subtaskAdd = document.getElementById("subtask-display-overlay");
    let subtaskInputValue = document.getElementById("subtask-overlay").value.trim();
    subtaskAdd.innerHTML = "";

    if (subtaskInputValue !== "") {
        await subtaskInput.push(subtaskInputValue);

        const subtaskId = Date.now();

        const subtask = {
            subtaskId: subtaskId,
            subtasksText: subtaskInputValue,
            isChecked: false,
        };

        subtasks.push(subtask);

        for (let i = 0; i < subtaskInput.length; i++) {
            subtaskAdd.innerHTML += `
          <span contenteditable="true" class="span-container-overlay" id="sub-span-${i}">
              <div class="subtask-preview-overlay" id="preview-${i}" onclick="subtaskFocus(${i})"><div class="list-item-overlay" id="list-item-${i}"></div><p id="sub-content-${i}">${subtaskInput[i]}</p></div>
              <div class="subtask-icon-container-overlay" id="icon-container-${i}">
                  <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover-overlay" onclick="subtaskFocus(${i})">
                  <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
                  <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
              </div>
          </span>
        `;
        }
    }
    cancelSubtask();
}

function deleteSubtask(i) {
    subtaskInput.splice(i, 1);
    let subtaskSpan = document.getElementById(`sub-span-${i}`);
    if (subtaskSpan) {
        subtasks.splice(i);
        subtaskSpan.remove();
    }
}

function subtaskFocus(i) {
    let subTaskSpan = document.getElementById(`sub-span-${i}`);
    let listItem = document.getElementById(`list-item-${i}`);
    let preview = document.getElementById(`preview-${i}`);
    let editIcon = document.getElementById(`icon-container-${i}`);

    subTaskSpan.classList.add("focus-input-overlay");
    listItem.classList.add("focus-list-item-overlay");
    preview.classList.add("focus-preview-overlay");

    editIcon.innerHTML = `
      <img src="./img/delete.png" alt="delete-icon" id="first-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
      <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
      <img src="./img/done.png" alt="done-icon" id="third-icon" class="hover-overlay" onclick="subtaskOutOfFocus(${i})">
    `;
}

function subtaskOutOfFocus(i) {
    let subtaskInputValue = document.getElementById(`sub-content-${i}`).innerText;
    let subtaskIndexValue = subtasks[i]["subtasksText"];

    if (subtaskInputValue !== subtaskIndexValue) {
        subtasks[i]["subtasksText"] = subtaskInputValue;
    }

    document.getElementById(`sub-span-${i}`).classList.remove("focus-input-overlay");
    document.getElementById(`list-item-${i}`).classList.remove("focus-list-item-overlay");
    document.getElementById(`preview-${i}`).classList.remove("focus-preview-overlay");
    let editIcon = document.getElementById(`icon-container-${i}`);

    editIcon.innerHTML = `
      <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover-overlay" onclick="subtaskFocus(${i})">
      <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon-overlay">
      <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover-overlay" onclick="deleteSubtask(${i})">
    `;
}

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

function prioSelectionOverlay(clickedPrio) {
    let prio = clickedPrio;
    let lowImg = document.getElementById("low-img-overlay");
    let mediumImg = document.getElementById("medium-img-overlay");
    let urgentImg = document.getElementById("urgent-img-overlay");

    document.getElementById("urgent-overlay").classList.remove("prioUrgent");
    document.getElementById("medium-overlay").classList.remove("prioMedium");
    document.getElementById("low-overlay").classList.remove("prioLow");

    lowImg.src = "./img/low.png";
    mediumImg.src = "./img/medium-prio.png";
    urgentImg.src = "./img/urgent-red-arrows.png";

    if (prio.id === "urgent-overlay") {
        prio.classList.add("prioUrgent");
        urgentImg.src = "./img/urgent-white-arrows.png";
    } else if (prio.id === "medium-overlay") {
        prio.classList.add("prioMedium");
        mediumImg.src = "./img/medium.png";
    } else if (prio.id === "low-overlay") {
        prio.classList.add("prioLow");
        lowImg.src = "./img/low-white-arrows.png";
    }

    priority = prio.id;
}

function clearAddTask() {
    document.getElementById("title-task-overlay").value = "";
    document.getElementById("description-task-overlay").value = "";
    document.getElementById("date-date-task-overlay").value = "";
    document.getElementById("chosen-task-overlay").innerHTML = "Select task category";
    document.getElementById("sub-profile-overlay").innerHTML = "";
    document.getElementById("subtask-display-overlay").innerHTML = "";

    let subProfile = document.getElementById("sub-profile-overlay");
    subProfile.innerHTML = "";

    subtaskInput = [];
    subtasks = [];
    sub_users = [];
    contactsUser = [];
    priority = priorityDefault;
    let medium = document.getElementById("medium-overlay");

    assignedTo();
    prioSelectionOverlay(medium);
    setClass('dropdown-parent-category-overlay', removeClass, 'dropdown-parent-container-wrong-overlay');
}

function addedTask() {
    let backLog = document.getElementById('task-added-success-overlay');
    backLog.classList.remove('d-none-overlay')

    setTimeout(function () {
        window.location.href = "board.html";
    }, 1000);
}


// Bitte pruefen!!!
function flipDropDownMenuCategory(dropDown, extension) {
    let overlay = (!extension) ? '' : '-overlay';
    let icon = getElement(`drop-down-icon-2${overlay}`);
    icon.src = (dropDown) ? './img/arrow_drop_down-up.png' : './img/arrow_drop_downaa.png';
    let subfunction = (dropDown) ? addClass : removeClass;
    setClass(`myDropdown-category${overlay}`, subfunction, `show${overlay}`);
    setClass(`dropdown-parent-category${overlay}`, subfunction, `dropdown-outline-focus${overlay}`);
    setClass(`dropdown-parent-category${overlay}`, subfunction, `dropdown-custom${overlay}`);
    dropDown = (dropDown) ? false : true;
    let closeOtherMenu = (dropDown && extension) ? '; flipDropDownMenu(false, true)' : '';
    nextFunction = (!extension) ? `flipDropDownMenuCategory(${dropDown})${closeOtherMenu}` : `flipDropDownMenuCategory(${dropDown}, ${extension})${closeOtherMenu}`;
    setElementAttribute(`dropdown-parent-category${overlay}`, 'onclick', nextFunction);
}


function selectCategory(clickedCategory) {
    let cat = clickedCategory;
    let categoryContainer = document.getElementById('chosen-task-overlay');
    heading = cat.id;

    categoryContainer.innerHTML = `${heading}`;
    flipDropDownMenuCategory(false, true);
    setClass('dropdown-parent-category-overlay', removeClass, 'dropdown-parent-container-wrong-overlay');
}

async function openAddTaskOverlay() {
    let bodyWidth = document.getElementById('body').offsetWidth;
    if (bodyWidth > 730) {
        addTaskInit();
        await document.getElementById('add-task-overlay').show();
        let overlay = document.getElementById('add-task-overlay-position');
        overlay.classList.add('add-task-overlay-in');
    } else {
        window.location.href = './add-task.html';
    }
}

async function closeAddTaskOverlay() {
    let overlay = document.getElementById('add-task-overlay-position');
    overlay.classList.remove('add-task-overlay-in');
    setTimeout(() => {
        document.getElementById('add-task-overlay').close();
        clearAddTask();
    }, 100);
}