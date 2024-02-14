// !!! WORK IN PROGRESS BITTE NICHT ANFASSEN !!!

// document.addEventListener("DOMContentLoaded", function(event) {

//     renderTasks()

// });

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let subtaskInput = [];
let priorityDefault = ('Medium');
priority = priorityDefault;

function scopeTasks() {
  let title = document.getElementById("title-task").value;
  let description = document.getElementById("description-task").value;
  let dueDate = document.getElementById('date date-task').value;

  let assignTask = document.getElementById("assign-task");
  let sub_users = assignTask.options[assignTask.selectedIndex].text;

  let categoryOption = document.getElementById("category");
  let category = categoryOption.options[categoryOption.selectedIndex].text;

  // let subTask = document.getElementById('sub-content').innerHTML;

  // for (let i = 0; i < subtaskInputs.length; i++) {
  //   const input = subtaskInputs[i];
  //   subtasks.push(input);
  // }

  const userID = {
    id: [
      {
        title: title,
        description: description,
        category: category,
        sub_users: sub_users,
        subTask: subtaskInput,
        priority: priority,
        dueDate: dueDate,
      },
    ],
  };

  localStorage.setItem("tasks", JSON.stringify(tasks));
  const userJSON = JSON.stringify(userID);
  userInfo = JSON.parse(userJSON);
  console.log(userInfo);
}

// async function setItem(key, value) {
//   const url = 'https://remote-storage.developerakademie.org/item';
//   const payload = { key, value };

//   return fetch(url, { method: 'POST', body: JSON.stringify(payload) });
// }

// function renderTasks() {
//   const board = document.querySelector(".board-body");
//   board.innerHTML = "";

//   tasks.forEach((task, index) => {
//     board.innerHTML += `
//         <div class="board-task-card" style="width: 252px;">
//         <h3 class="btc-type btc-type-blue">${task.category}</h3>
//         <div class="btc-group">
//             <div class="btc-title">${task.title}</div>
//             <div class="btc-description">${task.description}</div>
//         </div>
//         <div class="user-priority-group">
//             <div class="board-user-group">
//                 <div class="board-card-user bcu-yellow">EF</div>
//                 <div class="board-card-user bcu-purple">AS</div>
//                 <div class="board-card-user bcu-red">TW</div>
//             </div>
//             <img src="./img/medium-board.png" alt="medium-board">
//         </div>
//         </div>
//         `;
//   });
// }

function subtaskTemplate() {
  let subtaskForm = document.getElementById("subtask-form");
  subtaskForm.innerHTML = `
          <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask" value="Contact Form">
          <div class="subtask-add-icons">
            <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtask()">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/done.png" alt="add-icon" class="hover" onclick="addSubtask()">
          </div>
    `;
};

function cancelSubtask() {
  let subtaskForm = document.getElementById("subtask-form");
  subtaskForm.innerHTML = `
        <input class="sub-task-child" required placeholder="Add new subtask" type="text" id="subtask">
        <img src="./img/subtask.png" alt="add-icon" class="hover" onclick="subtaskTemplate()">
  `;
};

function addSubtask() {
  let subtaskAdd = document.getElementById("subtask-display");
  let subtaskInputValue = document.getElementById('subtask').value;
  subtaskAdd.innerHTML += `
  <div class="subtask-container">
    <div id="taskList" class="subtask-selector"><p id="sub-content"><span contenteditable="true">${subtaskInputValue}</span></p></div>
  </div>
  `;

  subtaskInput.push(subtaskInputValue)
  cancelSubtask()
};

function prioSelection(clickedPrio) {
  let prio = clickedPrio;
  let lowImg= document.getElementById('low-img');
  let mediumImg= document.getElementById('medium-img');
  let urgentImg= document.getElementById('urgent-img');

  document.getElementById('Urgent').classList.remove('prioUrgent');
  document.getElementById('Medium').classList.remove('prioMedium');
  document.getElementById('Low').classList.remove('prioLow');

  lowImg.src = './img/low.png';
  mediumImg.src = './img/medium-prio.png';
  urgentImg.src = './img/urgent-red-arrows.png';

    if (prio.id === 'Urgent') {
      prio.classList.add('prioUrgent')
      urgentImg.src = './img/urgent-white-arrows.png'
    }

    else if (prio.id === 'Medium') {
      prio.classList.add('prioMedium')
      mediumImg.src = './img/medium.png'
    }

    else if (prio.id === 'Low') {
      prio.classList.add('prioLow')
      lowImg.src = './img/low-white-arrows.png'
    }

    priority = prio.id;
}