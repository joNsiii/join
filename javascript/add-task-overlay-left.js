let subtaskInput = [];
let priorityDefault = "medium-overlay";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;
let assignableContacts = [];


/**
 * Initializes the add task overlay.
 */
async function addTaskInit() {
    await loadTasks();
    await loadUsers();
    await loadAssignableContacts();
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
 * Loads the assignable contacts.
 */
async function loadAssignableContacts() {
    assignableContacts = [];
    getAssignableUser();
    getAssignableContacts();
}


/**
 * Provides the assignable user.
 */
function getAssignableUser() {
    let user = currentUserData;
    user['userId'] = 0;
    if (user.name.includes(' (You)')) {
        assignableContacts.push(user);
    } else {
        user.name += ' (You)';
        assignableContacts.push(user);
    }
}


/**
 * Provides the assignable contacts.
 */
function getAssignableContacts() {
    let contacts = currentUserData.contacts;
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        contact['userId'] = i + 1;
        assignableContacts.push(contact);
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
    for (let i = 0; i < assignableContacts.length; i++) {
        const contact = assignableContacts[i];
        const bgc = `bgc-${contact['bgc-name']}`;
        let letterGroup = getFirstLastInitial(contact.name);
        assignElement.innerHTML += `
            <div class="subuser-selection-overlay" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
                <div class="subuser-align-overlay"><div class="sub-profile-img-overlay ${bgc}">${letterGroup}</div><div>${contact.name}</div></div>  
                <div class="checkbox-overlay"><img src="./img/checkmark-unchecked.png" alt="checkbox" id="checkbox-remember-me-${i}"></div>  
            </div>
        `;
    }
}


/**
 * Provides a name's initial letters.
 * @param {String} name - The providing name.
 * @returns - The name's initial letters.
 */
function getFirstLastInitial(name) {
    let last;
    if (name.includes(' ') && name.includes(' (You)')) {
        name = name.split(' ');
        last = name.length - 2;
        return name[0][0] + name[last][0]
    } else if (name.includes(' ')) {
        name = name.split(' ');
        last = name.length - 1;
        return name[0][0] + name[last][0]
    } else {
        return name[0];
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
    (logical) ? pushAssignedContact(i) : spliceAssignedSubuser(i);
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


function pushAssignedContact(i) {
    let contact = assignableContacts[i];
    sub_users.push(
        {
            userIdIterate: i,
            userId: i,
            name: contact.name,
            mail: contact.mail,
            "bgc-name": contact["bgc-name"]
        }
    );
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


/**
 * Renders the assigned subusers.
 */
function renderAssigendSubuser() {
    let subProfile = getElement("sub-profile-overlay");
    subProfile.innerHTML = '';
    for (let j = 0; j < sub_users.length; j++) {
        let subBgc = "bgc-" + sub_users[j]['bgc-name'];
        let contactId = sub_users[j]["userIdIterate"];
        let subProfileName = sub_users[j].name;
        let letterGroup = getFirstLastInitial(subProfileName);
        subProfile.innerHTML += `
        <div class="sub-profile-img-overlay sub-p-overlay ${subBgc}" id="contact-id-${contactId}"onclick="removeSubPB(${contactId})">${letterGroup}</div>
      `;
    }
}


/**
 * Removes an assigned subuser from the array sub_users.
 * @param {number} subuserId - The id of the subuser to remove.
 */
function removeSubPB(subuserId) {
    spliceAssignedSubuser(subuserId);
    renderSubProfiles(subuserId);
}


/**
 * Renders a subuser's profile.
 * @param {number} i - The subuser's id to render.
 */
function renderSubProfiles(i) {
    setElementAttribute(`checkbox-remember-me-${i}`, 'src', './img/checkmark-unchecked.png');
    setClass(`subuser-div-${i}`, removeClass, 'sub-background-overlay');
    getElement(`contact-id-${i}`).remove();
}