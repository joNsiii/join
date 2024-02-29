let subtaskInput = [];
let priorityDefault = "Medium";
let subtasks = [];
let sub_users = [];
let contactsUser = [];
let heading = "";
priority = priorityDefault;

// document.addEventListener('DOMContentLoaded', async function() {
//   await loadTasks();
//   await loadUsers();
//   assignedTo();
// })

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
        date: dueDate,
    };
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
    <button class="createBtn" onclick="addedTask()" disabled>Create Task <img src="./img/check.png" alt="check"></button>`;
    }
    if (user !== undefined) {
        assignElement.innerHTML = "";
        document.getElementById('button-container').innerHTML = `                    
    <div class="clearBtn" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
    <button class="createBtn" onclick="addedTask()"> Create Task <img src="./img/check.png" alt="check"></button>`;
        user.name = user.name;
        contactsUser.push(user);
        for (let i = 0; i < user.contacts.length; i++) {
            let contact = user.contacts[i];
            contactsUser.push(contact);
        }

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
            assignElement.innerHTML += `
        <div class="subuser-selection" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
          <div class="subuser-align">
            <div class="sub-profile-img-overlay ${bgc}">${letterGroup}</div>
            <div>${contact}</div>
          </div>  
            <div class="checkbox"><img src="./img/checkmark-unchecked.png" alt="checkbox"
              id="checkbox-remember-me-${i}"></div>  
        </div>
      `;
        }
    }
}


// function assignedTo() {
//     let assignElement = document.getElementById("myDropdown");
//     assignElement.innerHTML = "";

//     let user = currentUserData;
//     if (user == undefined || user == null || user == "") {
//         assignElement.innerHTML = "<div class=subuser-align>No Contacts Found</div>";
//         document.getElementById('button-container').innerHTML = `                    
//     <div class="clearBtn" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
//     <button class="createBtn" onclick="addedTask()" disabled>Create Task <img src="./img/check.png" alt="check"></button>`;
//     }
//     if (user !== undefined) {
//         assignElement.innerHTML = "";
//         document.getElementById('button-container').innerHTML = `                    
//     <div class="clearBtn" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
//     <button class="createBtn" onclick="addedTask()"> Create Task <img src="./img/check.png" alt="check"></button>`;
//         user.name = user.name;
//         contactsUser.push(user);
//         for (let i = 0; i < user.contacts.length; i++) {
//             let contact = user.contacts[i];
//             contactsUser.push(contact);
//         }

//         for (let i = 0; i < users.length; i++) {
//             const bgc = `bgc-${users[i]["bgc-name"]}`;
//             const contact = users[i].name;
//             let yourName = contact.includes(" (You") ? true : false;
//             let names = contact.split(" ");
//             let letterGroup;
//             if (!yourName) {
//                 letterGroup = names[0][0] + names[names.length - 1][0];
//             } else {
//                 letterGroup = names[0][0] + names[names.length - 2][0];
//             }
//             assignElement.innerHTML += `
//         <div class="subuser-selection" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
//           <div class="subuser-align">
//             <div class="sub-profile-img-overlay ${bgc}">${letterGroup}</div>
//             <div>${contact}</div>
//           </div>  
//             <div class="checkbox"><img src="./img/checkmark-unchecked.png" alt="checkbox"
//               id="checkbox-remember-me-${i}"></div>  
//         </div>
//       `;
//         }
//     }
// }


function dropDownMenu() {
    let icon = document.getElementById("drop-down-icon");
    document.getElementById("myDropdown").classList.toggle("show");
    document
        .getElementById("dropdown-parent")
        .classList.toggle("dropdown-outline-focus");
    document
        .getElementById("dropdown-parent")
        .classList.toggle("dropdown-custom");

    if (icon.src.includes("arrow_drop_downaa.png")) {
        icon.src = "./img/arrow_drop_down-up.png";
    } else {
        icon.src = "./img/arrow_drop_downaa.png";
    }
}

function toggleCheckbox(i) {
    let checkBox = document.getElementById(`checkbox-remember-me-${i}`);
    let background = document.getElementById(`subuser-div-${i}`);
    let subProfile = document.getElementById("sub-profile");
    let subuserTemp = users[i];
    let subUserIdTemp = users[i]["userId"];
    subProfile.innerHTML = "";

    if (checkBox.src.includes("checkmark-unchecked.png")) {
        checkBox.src = "./img/checkmark-white.png";
        background.classList.add("sub-background");
        let sub_users_child = `Temp-${i}`;
        sub_users.push({
            userIdIterate: i,
            userId: subUserIdTemp,
            name: subuserTemp.name,
            "bgc-name": subuserTemp["bgc-name"],
        });
    } else {
        checkBox.src = "./img/checkmark-unchecked.png";
        background.classList.remove("sub-background");

        let subuserToRemove = sub_users.findIndex(
            (user) => user.name === `Temp-${i}`
        );
        sub_users.splice(subuserToRemove, 1);
    }

    for (let j = 0; j < sub_users.length; j++) {
        let subBgc = "bgc-" + sub_users[j].userBackgroundColor;
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
        // let subProfileName = subuserTemp.slice(0, 2);
        subProfile.innerHTML += `
        <div class="sub-profile-img-overlay sub-p ${subBgc}" id="contact-id-${contactId}"onclick="removeSubPB(${contactId})">${letterGroup}</div>
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

function renderSubProfiles(index) {
    let subProfile = document.getElementById("sub-profile");
    document.getElementById(`checkbox-remember-me-${index}`).src =
        "./img/checkmark-unchecked.png";
    background = document
        .getElementById(`subuser-div-${index}`)
        .classList.remove("sub-background");

    let deleteContact = document.getElementById(`contact-id-${index}`);
    deleteContact.remove();
}

window.onclick = function (event) {
    if (
        !event.target.matches(".dropdown-parent-container") &&
        !event.target.closest(".dropdown-menu-sub")
    ) {
        let dropdowns = document.getElementsByClassName("dropdown-menu-sub");
        let icon = document.getElementById("drop-down-icon");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
                document
                    .getElementById("dropdown-parent")
                    .classList.toggle("dropdown-outline-focus");
                document
                    .getElementById("dropdown-parent")
                    .classList.toggle("dropdown-custom");
            }
            if (icon.src.includes("arrow_drop_down-up.png")) {
                icon.src = "./img/arrow_drop_downaa.png";
            }
        }
    }
};

function subtaskCustomTemplate() {
    let subtaskForm = document.getElementById("icon-hold");
    let subtaskValueCheck = document.getElementById("subtask");

    subtaskForm.innerHTML = `
        <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
        <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()">
      `;
    cancelSubtaskSafety();
}

function subtaskTemplate() {
    let subtaskForm = document.getElementById("subtask-form");
    let subtaskValueCheck = document.getElementById("subtask");

    if (subtaskValueCheck.value == "" || subtaskValueCheck.value == null) {
        subtaskForm.innerHTML = `
      <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask" value="Contact Form">
      <div class="subtask-add-icons-overlay" id="icon-hold">
        <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
        <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
        <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()">
      </div>
      `;
    }
}

function cancelSubtask() {
    let subtaskForm = document.getElementById("subtask-form");
    subtaskForm.innerHTML = `
      <input class="sub-task-child" placeholder="Add new subtask" type="text" id="subtask" onclick="subtaskCustomTemplate()">
      <div class="subtask-add-icons-overlay" id="icon-hold">
      <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="subtaskTemplate()">
      </div>
    `;
}

function cancelSubtaskSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = document.getElementById("subtask-form");
        let subtaskInput = document.getElementById("subtask");

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
    let subtaskAdd = document.getElementById("subtask-display");
    let subtaskInputValue = document.getElementById("subtask").value.trim();
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
          <span contenteditable="true" class="span-container" id="sub-span-${i}">
              <div class="subtask-preview" id="preview-${i}" onclick="subtaskFocus(${i})"><div class="list-item" id="list-item-${i}"></div><p id="sub-content-${i}">${subtaskInput[i]}</p></div>
              <div class="subtask-icon-container" id="icon-container-${i}">
                  <img src="./img/edit-contacts.png" alt="edit-icon" id="first-icon" class="hover" onclick="subtaskFocus(${i})">
                  <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
                  <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover" onclick="deleteSubtask(${i})">
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
      <img src="./img/delete.png" alt="delete-icon" id="third-icon" class="hover" onclick="deleteSubtask(${i})">
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

function clearAddTask() {
    document.getElementById("title-task").value = "";
    document.getElementById("description-task").value = "";
    document.getElementById("date-date-task").value = "";
    document.getElementById("chosen-task").innerHTML = "Select task category";
    document.getElementById("sub-profile").innerHTML = "";
    document.getElementById("subtask-display").innerHTML = "";

    let subProfile = document.getElementById("sub-profile");
    subProfile.innerHTML = "";

    subtaskInput = [];
    subtasks = [];
    sub_users = [];
    contactsUser = [];
    priority = priorityDefault;

    assignedTo();
    prioSelection(Medium);
}

function addedTask() {
    let backLog = document.getElementById('task-added-success');
    backLog.classList.remove('d-none')

    setTimeout(function () {
        window.location.href = "board.html";
    }, 1000);
}

function dropDownMenuCategory() {
    document.getElementById("myDropdown-category").classList.toggle("show");
    let icon = document.getElementById("drop-down-icon-2");
    document
        .getElementById("dropdown-parent-category")
        .classList.toggle("dropdown-outline-focus");
    document
        .getElementById("dropdown-parent-category")
        .classList.toggle("dropdown-custom");

    if (icon.src.includes("arrow_drop_downaa.png")) {
        icon.src = "./img/arrow_drop_down-up.png";
    } else {
        icon.src = "./img/arrow_drop_downaa.png";
    }
}

function selectCategory(clickedCategory) {
    let cat = clickedCategory;
    let categoryContainer = document.getElementById('chosen-task');
    heading = cat.id;

    categoryContainer.innerHTML = `${heading}`;
    dropDownMenuCategory()
}

// not working with assigned to dropdown

// window.onclick = function (event) {
//   if (
//     !event.target.matches(".dropdown-parent-container") &&
//     !event.target.closest(".dropdown-menu-category")
//   ) {
//     let dropdowns = document.getElementsByClassName("dropdown-menu-category");
//     let icon = document.getElementById("drop-down-icon-2");
//     for (let i = 0; i < dropdowns.length; i++) {
//       let openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains("show")) {
//         openDropdown.classList.remove("show");
//         document
//           .getElementById("dropdown-parent-category")
//           .classList.toggle("dropdown-outline-focus");
//         document
//           .getElementById("dropdown-parent-category")
//           .classList.toggle("dropdown-custom");
//       }
//       if (icon.src.includes("arrow_drop_down-up.png")) {
//         icon.src = "./img/arrow_drop_downaa.png";
//       }
//     }
//   }
// };




async function openAddTaskOverlay() {
    let bodyWidth = document.getElementById('body').offsetWidth;
    if (bodyWidth > 730) {
        addTaskInit();
        await document.getElementById('add-task-overlay').show();
        let overlay = document.getElementById('add-task-overlay-position');
        overlay.innerHTML = `
        .add-task-overlay-position {
            left: calc(50% - 558px);
            transition: 100ms left ease-in-out;
        }
    `;
    } else {
        window.location.href = './add-task.html';
    }
}

async function closeAddTaskOverlay() {
    let overlay = document.getElementById('add-task-overlay-position');
    overlay.innerHTML = `
        .add-task-overlay-position {
            left: 100%;
            transition: 100ms left ease-in-out;
        }
    `;
    setTimeout(() => {
        document.getElementById('add-task-overlay').close();
        clearAddTask();
    }, 100);
}