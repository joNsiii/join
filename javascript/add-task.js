let subtaskInput = [];
let priorityDefault = ('Medium');
emptyArray = [];
priority = priorityDefault;

document.addEventListener('DOMContentLoaded', function() {
  loadTasks();
})


async function loadTasks() {
  try {
    boardTasks = JSON.parse(await getItem("boardTasks"));
  } catch (error) {
    console.log(error)
  }  
}

async function scopeTasks() {
      let title = document.getElementById("title-task").value;
      let description = document.getElementById("description-task").value;
      let dueDate = document.getElementById('date-date-task').value;

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
          subtasks: [],
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
      console.log('Task added successfully:', task);
  };

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