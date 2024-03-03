let subtaskInput = [];
let priorityDefault = "Medium";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;

async function addTaskInit() {
  await init();
  await applyGuestSettingsAddTask();
  await loadTasks();
  await loadUsers();
  assignedTo();
}

async function applyGuestSettingsAddTask() {
  if (!userIsLoggedIn()) {
    let addTaskButton = document.getElementById('create-new-task-button');
    addTaskButton.disabled = true;
  }
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

async function pushTasks(task) {
  boardTasks.push(task);
  await setItem("boardTasks", JSON.stringify(boardTasks));
  console.log("Task added successfully:", task);
}

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

function subtaskFocusOptions(assignElement, user) {
  subtaskSecondaryOptions(assignElement, user);
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

function renderFocusOptions(assignElement, i, bgc, letterGroup, contact) {
  assignElement.innerHTML += `
  <div class="subuser-selection" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
    <div class="subuser-align">
      <div class="sub-profile-img ${bgc}">${letterGroup}</div>
        <div>${contact}</div> </div>  
          <div class="checkbox"><img src="./img/checkmark-unchecked.png" alt="checkbox"
            id="checkbox-remember-me-${i}"></div> </div> `;
}

function subtaskSecondaryOptions(assignElement, user) {
  assignElement.innerHTML = "";
  document.getElementById('button-container').innerHTML = `                    
    <div class="clearBtn" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
     <button id="create-new-task-button" class="createBtn" onclick="addedTask()"> Create Task <img src="./img/check.png" alt="check"></button> `;
  user.name = user.name;
  contactsUser.push(user);
  for (let i = 0; i < user.contacts.length; i++) {
    let contact = user.contacts[i];
    contactsUser.push(contact);
  }
}

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

function stop(event) {
  event.stopPropagation();
}

// function dropDownMenu() {
//   let icon = document.getElementById("drop-down-icon");
//   document.getElementById("myDropdown").classList.toggle("show");
//   document.getElementById("dropdown-parent").classList.toggle("dropdown-outline-focus");
//   document.getElementById("dropdown-parent").classList.toggle("dropdown-custom");

//   if (icon.src.includes("arrow_drop_downaa.png")) {
//     icon.src = "./img/arrow_drop_down-up.png";
//   } else {
//     icon.src = "./img/arrow_drop_downaa.png";
//   }
// }

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

function checkboxDeselect(i, checkBox, background) {
  checkBox.src = "./img/checkmark-unchecked.png";
  background.classList.remove("sub-background");

  let subuserToRemove = sub_users.findIndex(
    (user) => user.name === `Temp-${i}`
  );
  sub_users.splice(subuserToRemove, 1);
}

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

function removeSubPB(subuserId) {
  let indexToRemove = sub_users.findIndex((user) => user.userIdIterate === subuserId);
  if (indexToRemove !== -1) {
    sub_users.splice(indexToRemove, 1);
    clearDropdown(subuserId);
  }
}

function clearDropdown(index) {
  document.getElementById(`checkbox-remember-me-${index}`).src = "./img/checkmark-unchecked.png";
  background = document.getElementById(`subuser-div-${index}`).classList.remove("sub-background");
  let deleteContact = document.getElementById(`contact-id-${index}`);
  deleteContact.remove();
}

function subtaskCustomTemplate() {
  let subtaskForm = document.getElementById("icon-hold");
  subtaskForm.innerHTML = `
    <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
    <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
    <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()"> `;
  cancelSubtaskSafety();
}

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

function cancelSubtaskSafety() {
  document.addEventListener("click", function (event) {
    let subtaskForm = document.getElementById("subtask-form");
    let subtaskInput = document.getElementById("subtask");
    if (event.target !== subtaskInput && !subtaskForm.contains(event.target) && subtaskInput.value === "") {
      cancelSubtask();
    }
  });
}

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

function cancelSubtask() {
  let subtaskForm = document.getElementById("subtask-form");
  subtaskForm.innerHTML = `
      <input class="sub-task-child" placeholder="Add new subtask" type="text" id="subtask" onclick="subtaskCustomTemplate()">
        <div class="subtask-add-icons" id="icon-hold">
          <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="subtaskTemplate()">
      </div>
    `;
}

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

function clearArrays() {
  subtaskInput = [];
  subtasks = [];
  sub_users = [];
  contactsUser = [];
  priority = priorityDefault;
}

function addedTask() {
  let backLog = document.getElementById('task-added-success');
  backLog.classList.remove('d-none')
  setTimeout(function () {
    window.location.href = "board.html";
  }, 1000);
}

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

// function dropDownMenuCategory() {
//   let icon = document.getElementById("drop-down-icon-2");
//   document.getElementById("myDropdown-category").classList.toggle("show");
//   document.getElementById("dropdown-parent-category").classList.toggle("dropdown-outline-focus");
//   document.getElementById("dropdown-parent-category").classList.toggle("dropdown-custom");
//   if (icon.src.includes("arrow_drop_downaa.png")) {
//     icon.src = "./img/arrow_drop_down-up.png";
//   } else {
//     icon.src = "./img/arrow_drop_downaa.png";
//   }
// }

function selectCategory(clickedCategory) {
  let cat = clickedCategory;
  let categoryContainer = document.getElementById('chosen-task');
  heading = cat.id;

  categoryContainer.innerHTML = `${heading}`;
  flipDropDownMenuCategory(false);
  // dropDownMenuCategory();
}

// window.onclick = function (event) {
//   if (!event.target.matches(".dropdown-parent-container") && !event.target.closest(".dropdown-menu-sub")) {
//     let dropdowns = document.getElementsByClassName("dropdown-menu-sub");
//     let icon = document.getElementById("drop-down-icon");
//     for (let i = 0; i < dropdowns.length; i++) {
//       let openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains("show")) {
//         openDropdown.classList.remove("show");
//         document.getElementById("dropdown-parent").classList.toggle("dropdown-outline-focus");
//         document.getElementById("dropdown-parent").classList.toggle("dropdown-custom");
//       }
//       if (icon.src.includes("arrow_drop_down-up.png")) {
//         icon.src = "./img/arrow_drop_downaa.png";
//       }}};
// };

const scrollContainer = document.getElementById("sub-profile");

scrollContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  scrollContainer.scrollLeft += evt.deltaY;
});