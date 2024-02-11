const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener("DOMContentLoaded", function(event) {

    renderTasks();
});

function scopeTasks() {

let title = document.getElementById('title-task').value;
let description = document.getElementById('description-task').value;
let dueDate = document.getElementById('date"').value;

var e = document.getElementById("assign-task");
let assignedTo = e.options[e.selectedIndex].text;

var h = document.getElementById("category");
let category = h.options[h.selectedIndex].text;

const task = {
    title: title,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDate,
    category: category
};

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));

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
