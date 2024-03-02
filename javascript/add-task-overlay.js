let subtaskInput = [];
let priorityDefault = "medium-overlay";
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
    let title = document.getElementById("title-task-overlay").value;
    let description = document.getElementById("description-task-overlay").value;
    let dueDate = document.getElementById("date-date-task-overlay").value;

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
    let assignElement = document.getElementById("myDropdown-overlay");
    assignElement.innerHTML = "";

    let user = currentUserData;
    if (user == undefined || user == null || user == "") {
        assignElement.innerHTML = '<div class="subuser-align-overlay">No Contacts Found</div>';
        document.getElementById('button-container-overlay').innerHTML = `                    
    <div class="clearBtn-overlay" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
    <button class="createBtn-overlay" onclick="addedTask()" disabled>Create Task <img src="./img/check.png" alt="check"></button>`;
    }
    if (user !== undefined) {
        assignElement.innerHTML = "";
        document.getElementById('button-container-overlay').innerHTML = `                    
    <div class="clearBtn-overlay" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
    <button class="createBtn-overlay" onclick="addedTask()"> Create Task <img src="./img/check.png" alt="check"></button>`;
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
        <div class="subuser-selection-overlay" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
          <div class="subuser-align-overlay">
            <div class="sub-profile-img-overlay ${bgc}">${letterGroup}</div>
            <div>${contact}</div>
          </div>  
            <div class="checkbox-overlay"><img src="./img/checkmark-unchecked.png" alt="checkbox"
              id="checkbox-remember-me-${i}"></div>  
        </div>
      `;
        }
    }
}


// function assignedTo() {
//     let assignElement = document.getElementById("myDropdown-overlay");
//     assignElement.innerHTML = "";

//     let user = currentUserData;
//     if (user == undefined || user == null || user == "") {
//         assignElement.innerHTML = '<div class="subuser-align-overlay">No Contacts Found</div>';
//         document.getElementById('button-container-overlay').innerHTML = `                    
//     <div class="clearBtn-overlay" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
//     <button class="createBtn-overlay" onclick="addedTask()" disabled>Create Task <img src="./img/check.png" alt="check"></button>`;
//     }
//     if (user !== undefined) {
//         assignElement.innerHTML = "";
//         document.getElementById('button-container-overlay').innerHTML = `                    
//     <div class="clearBtn-overlay" onclick="clearAddTask()">Clear <img src="./img/cancel.png" alt="clear"></div>
//     <button class="createBtn-overlay" onclick="addedTask()"> Create Task <img src="./img/check.png" alt="check"></button>`;
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
//         <div class="subuser-selection-overlay" onclick="toggleCheckbox(${i})" id="subuser-div-${i}">
//           <div class="subuser-align-overlay">
//             <div class="sub-profile-img-overlay ${bgc}">${letterGroup}</div>
//             <div>${contact}</div>
//           </div>  
//             <div class="checkbox-overlay"><img src="./img/checkmark-unchecked.png" alt="checkbox"
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
function dropDownMenuOverlay() {
    let icon = document.getElementById("drop-down-icon-overlay");
    document.getElementById("myDropdown-overlay").classList.toggle("show-overlay");
    document
        .getElementById("dropdown-parent-overlay")
        .classList.toggle("dropdown-outline-focus-overlay");
    document
        .getElementById("dropdown-parent-overlay")
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
    let subProfile = document.getElementById("sub-profile-overlay");
    let subuserTemp = users[i];
    let subUserIdTemp = users[i]["userId"];
    subProfile.innerHTML = "";

    if (checkBox.src.includes("checkmark-unchecked.png")) {
        checkBox.src = "./img/checkmark-white.png";
        background.classList.add("sub-background-overlay");
        let sub_users_child = `Temp-${i}`;
        sub_users.push({
            userIdIterate: i,
            userId: subUserIdTemp,
            name: subuserTemp.name,
            "bgc-name": subuserTemp["bgc-name"],
        });
    } else {
        checkBox.src = "./img/checkmark-unchecked.png";
        background.classList.remove("sub-background-overlay");

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

function renderSubProfiles(index) {
    let subProfile = document.getElementById("sub-profile-overlay");
    document.getElementById(`checkbox-remember-me-${index}`).src =
        "./img/checkmark-unchecked.png";
    background = document
        .getElementById(`subuser-div-${index}`)
        .classList.remove("sub-background-overlay");

    let deleteContact = document.getElementById(`contact-id-${index}`);
    deleteContact.remove();
}

window.onclick = function (event) {
    if (
        !event.target.matches(".dropdown-parent-container-overlay") &&
        !event.target.closest(".dropdown-menu-sub-overlay")
    ) {
        let dropdowns = document.getElementsByClassName("dropdown-menu-sub-overlay");
        let icon = document.getElementById("drop-down-icon-overlay");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show-overlay")) {
                openDropdown.classList.remove("show-overlay");
                document
                    .getElementById("dropdown-parent-overlay")
                    .classList.toggle("dropdown-outline-focus-overlay");
                document
                    .getElementById("dropdown-parent-overlay")
                    .classList.toggle("dropdown-custom");
            }
            if (icon.src.includes("arrow_drop_down-up.png")) {
                icon.src = "./img/arrow_drop_downaa.png";
            }
        }
    }
};

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
}

function addedTask() {
    let backLog = document.getElementById('task-added-success-overlay');
    backLog.classList.remove('d-none-overlay')

    setTimeout(function () {
        window.location.href = "board.html";
    }, 1000);
}

function dropDownMenuCategory() {
    document.getElementById("myDropdown-category-overlay").classList.toggle("show-overlay");
    let icon = document.getElementById("drop-down-icon-2-overlay");
    document
        .getElementById("dropdown-parent-category-overlay")
        .classList.toggle("dropdown-outline-focus-overlay");
    document
        .getElementById("dropdown-parent-category-overlay")
        .classList.toggle("dropdown-custom");

    if (icon.src.includes("arrow_drop_downaa.png")) {
        icon.src = "./img/arrow_drop_down-up.png";
    } else {
        icon.src = "./img/arrow_drop_downaa.png";
    }
}

function selectCategory(clickedCategory) {
    let cat = clickedCategory;
    let categoryContainer = document.getElementById('chosen-task-overlay');
    heading = cat.id;

    categoryContainer.innerHTML = `${heading}`;
    dropDownMenuCategory()
}

// not working with assigned to dropdown

// window.onclick = function (event) {
//   if (
//     !event.target.matches(".dropdown-parent-container-overlay") &&
//     !event.target.closest(".dropdown-menu-category-overlay")
//   ) {
//     let dropdowns = document.getElementsByClassName("dropdown-menu-category-overlay");
//     let icon = document.getElementById("drop-down-icon-2-overlay");
//     for (let i = 0; i < dropdowns.length; i++) {
//       let openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains("show-overlay")) {
//         openDropdown.classList.remove("show-overlay");
//         document
//           .getElementById("dropdown-parent-category-overlay")
//           .classList.toggle("dropdown-outline-focus-overlay");
//         document
//           .getElementById("dropdown-parent-category-overlay")
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