// Variables
let subtaskInput = [];
let priorityDefault = "Medium";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;

/**
 * Initializing Functions out of the global.js to apply guest aswell as user settings.
 */
async function addTaskInit() {
  await init();
  await applyGuestSettingsAddTask();
  await loadTasks();
  await loadUsers();
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
  for (let i = 0; i < users.length; i++) {
    const bgc = `bgc-${users[i]["bgc-name"]}`;
    const contact = users[i].name;
    let yourName = contact.includes(" (You") ? true : false;
    let names = contact.split(" ");
    let letterGroup;
    if (!yourName) {
      letterGroup = names[0][0] + names[names.length - 1][0];
    } else {
      letterGroup = names[0][0] + names[names.length - 2][0];
    }
    renderFocusOptions(assignElement, i, bgc, letterGroup, contact);
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
        <div>${contact}</div> </div>  
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
  let subuserTemp = users[i];
  let subUserIdTemp = users[i]["userId"];
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
    (user) => user.name === `Temp-${i}`
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