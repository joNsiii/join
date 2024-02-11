

// !!! WORK IN PROGRESS BITTE NICHT ANFASSEN !!!

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// document.addEventListener("DOMContentLoaded", function(event) {

//     renderTasks()

// });

function scopeTasks() {

let title = document.getElementById('title-task').value;
let description = document.getElementById('description-task').value;
// let dueDate = document.getElementById('date"').value;

var e = document.getElementById("assign-task");
let assignedTo = e.options[e.selectedIndex].text;

var h = document.getElementById("category");
let category = h.options[h.selectedIndex].text;

// const task = {
//     title: title,
//     description: description,
//     assignedTo: assignedTo,
//     dueDate: dueDate,
//     category: category
// };

//     tasks.push(task);

const userID = {
    id: [
      {
        title: title,
        description: description,
        category: category,
        assignedTo: assignedTo,
        subTask: ["Blablablabla", "Blabloblolbolbo"],
        priority: "Medium",
        dueDate: dueDate,
      },
      {
        title: "Test Title 2",
        description: "Test Description 2",
        category: "Programming 2",
        assignedTo: "112224423",
        subTask: ["Blablablabla", "Blabloblolbolbo"],
        priority: "Low",
        dueDate: "XX:XX:XX",
      },
    ],
  };

    localStorage.setItem('tasks', JSON.stringify(tasks));
    const userJSON = JSON.stringify(userID);
    userInfo = JSON.parse(userJSON);
    console.log(userInfo)

};

function renderTasks() {
    const board = document.querySelector('.board-body');
    board.innerHTML = ''; 

    tasks.forEach((task, index) => {
        board.innerHTML += `
        <div class="board-task-card" style="width: 252px;">
        <h3 class="btc-type btc-type-blue">${task.category}</h3>
        <div class="btc-group">
            <div class="btc-title">${task.title}</div>
            <div class="btc-description">${task.description}</div>
        </div>
        <div class="user-priority-group">
            <div class="board-user-group">
                <div class="board-card-user bcu-yellow">EF</div>
                <div class="board-card-user bcu-purple">AS</div>
                <div class="board-card-user bcu-red">TW</div>
            </div>
            <img src="./img/medium-board.png" alt="medium-board">
        </div>
        </div>
        `;
    });
}

// function start() {
//     const userID = {
//         id: [
//           {
//             title: "Test Title",
//             description: "Test Description",
//             category: "Programming",
//             assignedTo: "112224433",
//             subTask: ["Blablablabla", "Blabloblolbolbo"],
//             priority: "Medium",
//             dueDate: "XX:XX:XX",
//           },
//           {
//             title: "Test Title 2",
//             description: "Test Description 2",
//             category: "Programming 2",
//             assignedTo: "112224423",
//             subTask: ["Blablablabla", "Blabloblolbolbo"],
//             priority: "Low",
//             dueDate: "XX:XX:XX",
//           },
//         ],
//       };
      
//       const userJSON = JSON.stringify(userID);
//       userInfo = JSON.parse(userJSON);
//       console.log(userInfo)
// }