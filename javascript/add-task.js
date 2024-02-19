let subtaskInput = [];
let priorityDefault = "Medium";
priority = priorityDefault;

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
});

async function loadTasks() {
  try {
    boardTasks = JSON.parse(await getItem("boardTasks"));
  } catch (error) {
    console.log(error);
  }
  assignedTo()
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
    subtasks: [
      {
        subtaskId: 1,
        subtasksText: subtaskInput,
        isChecked: false,
      },
      {
        subtaskId: 2,
        subtasksText: subtaskInput,
        isChecked: false,
      },
    ],
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
  // let emptyArray = [];
  boardTasks.push(task);

  await setItem("boardTasks", JSON.stringify(boardTasks));

  console.log("Task added successfully:", task);
}

function assignedTo() {
  let assignElement = document.getElementById("assign-task");
  assignElement.innerHTML = '';

  assignElement.innerHTML += `
    <option value="" disabled selected>Select contacts to assign</option>
  `;
  
  for (let i = 0; i < users.length; i++) {
    const element = users[i]["name"];
    assignElement.innerHTML += `
    <option value="">${element}</option>
    `;
  }
}

function subtaskTemplate() {
  let subtaskForm = document.getElementById("subtask-form");
  let subtaskValueCheck = document.getElementById("subtask");

  if (subtaskValueCheck.value == "" || subtaskValueCheck.value == null) {
    subtaskForm.innerHTML = `
    <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask" value="Contact Form">
    <div class="subtask-add-icons">
      <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
      <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
      <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()">
    </div>
    `;
  } else {
    subtaskForm.innerHTML = `
    <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask" value="${subtaskValueCheck.value}">
    <div class="subtask-add-icons">
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
        <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask">
        <img src="./img/subtask.png" alt="add-icon" class="hover" onclick="subtaskTemplate()">
  `;
}

async function addSubtask() {
  let subtaskAdd = document.getElementById("subtask-display");
  let subtaskInputValue = document.getElementById("subtask").value.trim();
  subtaskAdd.innerHTML = "";

  if (subtaskInputValue !== "") {
    await subtaskInput.push(subtaskInputValue);

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
