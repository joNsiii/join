let subtaskInput = [];
let priorityDefault = "Medium";
let subtasks = [];
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

async function scopeTasks() {
  // let getTasks = await getItem("boardTasks");
  // let boardTasks = JSON.parse(getTasks);

  let title = document.getElementById("title-task").value;
  let description = document.getElementById("description-task").value;
  let dueDate = document.getElementById("date-date-task").value;

  let assignTask = document.getElementById("assign-task");
  let sub_users_child = assignTask.options[assignTask.selectedIndex].text;

  let headingOption = document.getElementById("category");
  let heading = headingOption.options[headingOption.selectedIndex].text;

  const taskId = Date.now();

  let task = {
    taskId: taskId,
    title: title,
    description: description,
    category: "toDo",
    heading: heading,
    subtasks: subtasks,
    sub_users: [
      {
        userId: 0,
        name: sub_users_child,
        userBackgroundColor: "green", // Muss noch definiert werden
      },
    ],
    priority: priority,
    date: dueDate,
  };
  boardTasks.push(task);
  await setItem("boardTasks", JSON.stringify(boardTasks));
  console.log("Task added successfully:", task);
}

function assignedTo() {
  // Rudolf
  let assignElement = document.getElementById("myDropdown");
  assignElement.innerHTML = "";

  // Neu
  let currentUser = users.find((u) => u.userId == userId);
  let contacts = currentUser["assignable-contacts"];
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    assignElement.innerHTML += `
        <div class="subuser-selection" onclick="toggleCheckboxLogin(${i})" id="subuser-div-${i}">
          <div>${contact}</div>
          <div class="checkbox"><img src="./img/checkmark-unchecked.png" alt="checkbox"
            id="checkbox-remember-me-${i}"></div>
        </div>
      `;
  }
}

function dropDownMenu() {
  document.getElementById("myDropdown").classList.toggle("show");
  document
    .getElementById("dropdown-parent")
    .classList.toggle("dropdown-outline-focus");
  document
    .getElementById("dropdown-parent")
    .classList.toggle("dropdown-custom");
}

function toggleCheckboxLogin(i) {
  let checkBox = document.getElementById(`checkbox-remember-me-${i}`);
  let background = document.getElementById(`subuser-div-${i}`);

  if (checkBox.src.includes("checkmark-unchecked.png")) {
    checkBox.src = "./img/checkmark-white.png";
    background.classList.add("sub-background");
  } else {
    checkBox.src = "./img/checkmark-unchecked.png";
    background.classList.remove("sub-background");
  }
}

window.onclick = function (event) {
  if (!event.target.matches(".dropdown-parent-container") && !event.target.closest(".dropdown-menu-sub")) {
    let dropdowns = document.getElementsByClassName("dropdown-menu-sub");

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
      <div class="subtask-add-icons" id="icon-hold">
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
      <div class="subtask-add-icons" id="icon-hold">
      <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="subtaskTemplate()">
      </div>
    `;
}

function cancelSubtaskSafety() {
  document.addEventListener("click", function (event) {
    let subtaskForm = document.getElementById("subtask-form");
    let subtaskInput = document.getElementById("subtask");

    // Check if the clicked element is not the subtask input field or its parent
    // and if the input field is empty
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

function clear() {
  let titleInput = document.getElementById("title-task");
  let descriptionInput = document.getElementById("description-task");
  let dueDateInput = document.getElementById("date-date-task").value;
  let assignTaskInput = document.getElementById("assign-task");
  let sub_users_childInput =
    assignTaskInput.options[assignTaskInput.selectedIndex].text;
  let headingOptionInput = document.getElementById("category");
  let headingInput =
    headingOptionInput.options[headingOptionInput.selectedIndex].text;

  titleInput = "";
  descriptionInput = "";
  dueDateInput = "";
  sub_users_childInput = "";
  headingInput = "";

  subtaskInput = [];
  priority = priorityDefault;
}

// {
//   subtaskId: 1,
//   subtasksText: subtaskInput,
//   isChecked: false,
// },
// {
//   subtaskId: 2,
//   subtasksText: subtaskInput,
//   isChecked: false,
// },
