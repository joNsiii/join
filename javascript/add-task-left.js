// Variables
let subtaskInput = [];
let priorityDefault = "Medium";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;
let assignableContacts = [];

/**
 * Initializing Functions out of the global.js to apply guest aswell as user settings.
 */
async function addTaskInit() {
    await init();
    await applyGuestSettingsAddTask();
    await loadTasks();
    await loadUsers();
    await loadAssignableContacts();
    assignedTo();
}

/**
 * Disables the add-task-button if a guest is logged in. 
 */
async function applyGuestSettingsAddTask() {
    let addTaskButton = document.getElementById('create-new-task-button');
    if (!userIsLoggedIn()) {
        addTaskButton.disabled = true;
    } else {
        addTaskButton.disabled = false;
    }
}

/**
 * Fetches the boardTasks array from the server.
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
 * Reloads the page.
 */
function reloadPage() {
    location.reload();
}

/**
 * Declares the task input values into the task array that was chosen by the user inputs.
 */
function scopeTasks() {
    let title = document.getElementById("title-task").value;
    let description = document.getElementById("description-task").value;
    let dueDate = document.getElementById("date-date-task").value;
    const taskId = Date.now();

    let task = {
        taskId: taskId,
        title: title,
        description: description,
        category: "toDo",
        heading: heading,
        subtasks: subtasks,
        sub_users: sub_users,
        priority: priority,
        dueDate: dueDate,
    };
    pushTasks(task)
}

/**
 * task is being pushed to the boardTasks array which stores it on the server.
 * @param {Object} task - The task object that will be added.
 */
async function pushTasks(task) {
    boardTasks.push(task);
    await setItem("boardTasks", JSON.stringify(boardTasks));
    console.log("Task added successfully:", task);
}

/**
 * Renders the users to which the task can be assigned too.
 */
function assignedTo() {
    let assignElement = document.getElementById("myDropdown");
    assignElement.innerHTML = "";

    let user = currentUserData;
    if (user == undefined || user == null || user == "") {
        assignElement.innerHTML = "<div class=subuser-align>No Contacts Found</div>";
        document.getElementById('button-container').innerHTML = `                    
    <div class="clearBtn" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
      <button id="create-new-task-button" class="createBtn" onclick="addedTask()" disabled>Create Task <img src="./img/check.png" alt="check"></button>`;
    }
    if (user !== undefined) {
        subtaskFocusOptions(assignElement, user);
    }
}

/**
 * Declares the index of the total users, the individual background color of the profile, the inititials and yourself to pass it to the render function.
 * @param {HTMLElement} assignElement - HTML element which renders the options (users to add).
 * @param {Object} user - Current user object.
 */
function subtaskFocusOptions(assignElement, user) {
    for (let i = 0; i < assignableContacts.length; i++) {
        const contact = assignableContacts[i];
        const bgc = `bgc-${contact['bgc-name']}`;
        let letterGroup = getFirstLastInitial(contact.name);
        renderFocusOptions(assignElement, i, bgc, letterGroup, contact);
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
 * Renders the the dropdown menu for the Assigned to element.
 * @param {HTMLElement} assignElement - HTML element which renders the options (users to add).
 * @param {Object} user - Current user object.
 */
function renderFocusOptions(assignElement, i, bgc, letterGroup, contact) {
    assignElement.innerHTML += `
  <div class="subuser-selection" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
    <div class="subuser-align">
      <div class="sub-profile-img ${bgc}">${letterGroup}</div>
        <div>${contact.name}</div> </div>  
          <div class="checkbox"><img src="./img/checkmark-unchecked.png" alt="checkbox"
            id="checkbox-remember-me-${i}"></div> </div> `;
}

/**
 * Toggles the visibity of the Assigned To dropdown menu.
 * @param {boolean} dropDown - Boolean value whether to show or not show the dropdown menu.
 */
function flipDropDownMenu(dropDown) {
    let icon = document.getElementById("drop-down-icon");
    if (dropDown) {
        document.getElementById("myDropdown").classList.add("show");
        document.getElementById("dropdown-parent").classList.add("dropdown-outline-focus");
        document.getElementById("dropdown-parent").classList.add("dropdown-custom");
        icon.src = "./img/arrow_drop_down-up.png";
        document.getElementById('dropdown-parent').setAttribute('onclick', 'flipDropDownMenu(false)');
    } else {
        document.getElementById("myDropdown").classList.remove("show");
        document.getElementById("dropdown-parent").classList.remove("dropdown-outline-focus");
        document.getElementById("dropdown-parent").classList.remove("dropdown-custom");
        icon.src = "./img/arrow_drop_downaa.png";
        document.getElementById('dropdown-parent').setAttribute('onclick', 'flipDropDownMenu(true); flipDropDownMenuCategory(false)');
    }
}

/**
 * Toggles the visibity of the Category dropdown menu.
 * @param {boolean} dropDown - Boolean value whether to show or not show the dropdown menu.
 */
function flipDropDownMenuCategory(dropDown) {
    let icon = document.getElementById("drop-down-icon-2");
    if (dropDown) {
        document.getElementById("myDropdown-category").classList.add("show");
        document.getElementById("dropdown-parent-category").classList.add("dropdown-outline-focus");
        document.getElementById("dropdown-parent-category").classList.add("dropdown-custom");
        icon.src = "./img/arrow_drop_down-up.png";
        document.getElementById('dropdown-parent-category').setAttribute('onclick', 'flipDropDownMenuCategory(false)');
    } else {
        document.getElementById("myDropdown-category").classList.remove("show");
        document.getElementById("dropdown-parent-category").classList.remove("dropdown-outline-focus");
        document.getElementById("dropdown-parent-category").classList.remove("dropdown-custom");
        icon.src = "./img/arrow_drop_downaa.png";
        document.getElementById('dropdown-parent-category').setAttribute('onclick', 'flipDropDownMenu(false); flipDropDownMenuCategory(true)');
    }
}

/**
 * Prevents event propagation.
 * @param {Event} event - The event object.
 */
function stop(event) {
    event.stopPropagation();
}

/**
 * Toggles the checkbox of the Assigned to dropdown element wether to add or remove a subuser.
 * @param {number} i - Index of the subuser.
 */
function toggleCheckbox(i) {
    let checkBox = document.getElementById(`checkbox-remember-me-${i}`);
    let background = document.getElementById(`subuser-div-${i}`);
    let subProfile = document.getElementById("sub-profile");
    let subuserTemp = assignableContacts[i];
    let subUserIdTemp = assignableContacts[i]["userId"];
    subProfile.innerHTML = "";

    if (checkBox.src.includes("checkmark-unchecked.png")) {
        addSubuser(i, checkBox, background, subuserTemp, subUserIdTemp)
    } else {
        checkboxDeselect(i, checkBox, background)
    }
    for (let j = 0; j < sub_users.length; j++) {
        renderSubProfiles(j, subProfile)
    }
}

/**
 * Deselects the corresponding subuser and resets the checkbox.
 * @param {number} i - Index of the subuser.
 * @param {Element} checkBox - The checkbox element.
 * @param {Element} background - The background element.
 */
function checkboxDeselect(i, checkBox, background) {
    checkBox.src = "./img/checkmark-unchecked.png";
    background.classList.remove("sub-background");

    let subuserToRemove = sub_users.findIndex(
        (user) => user.userId === assignableContacts[i].userId
    );
    sub_users.splice(subuserToRemove, 1);
}

/**
 * Adds the selected subuser from Assigned To and pushes them into an array.
 * @param {number} i 
 * @param {Element} checkBox 
 * @param {Element} background 
 * @param {Object} subuserTemp 
 * @param {string} subUserIdTemp 
 */
function addSubuser(i, checkBox, background, subuserTemp, subUserIdTemp) {
    checkBox.src = "./img/checkmark-white.png";
    background.classList.add("sub-background");
    sub_users.push({
        userIdIterate: i,
        userId: subUserIdTemp,
        name: subuserTemp.name,
        mail: subuserTemp.mail,
        "bgc-name": subuserTemp["bgc-name"],
    });
}

/**
 * Renders the selected subusers into an container below the dropdown.
 * @param {number} j - Index of the subuser.
 * @param {Element} subProfile - The subprofile element.
 */
function renderSubProfiles(j, subProfile) {
    let subBgc = "bgc-" + sub_users[j]["bgc-name"];
    let subProfileName = sub_users[j].name;
    let contactId = sub_users[j]["userIdIterate"];
    let yourName = subProfileName.includes(" (You") ? true : false;
    let names = subProfileName.split(" ");
    let letterGroup;
    if (!yourName) {
        letterGroup = names[0][0] + names[names.length - 1][0];
    } else {
        letterGroup = names[0][0] + names[names.length - 2][0];
    }
    subProfile.innerHTML += `
      <div class="sub-profile-img sub-p ${subBgc}" id="contact-id-${contactId}"onclick="removeSubPB(${contactId})">${letterGroup}</div> `;
}

/**
 * Removes a subuser by clicking on their profile image which is rendered by renderSubProfiles().
 * @param {number} subuserId - ID of the subuser.
 */
function removeSubPB(subuserId) {
    let indexToRemove = sub_users.findIndex((user) => user.userIdIterate === subuserId);
    if (indexToRemove !== -1) {
        sub_users.splice(indexToRemove, 1);
        clearDropdown(subuserId);
    }
}

/**
 * Clears the dropdown and resets the corresponding elements. 
 * Removes the removed user from the array.
 * @param {number} index - Index of the subuser.
 */
function clearDropdown(index) {
    document.getElementById(`checkbox-remember-me-${index}`).src = "./img/checkmark-unchecked.png";
    background = document.getElementById(`subuser-div-${index}`).classList.remove("sub-background");
    let deleteContact = document.getElementById(`contact-id-${index}`);
    deleteContact.remove();
}