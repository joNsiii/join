let todos = [
    {
        id: 0,
        title: "Start with JS",
        description: "create reusable HTML base templates...",
        category: "toDo",
        heading: "Technical Task",
        subtasks: [],
        sub_users: [],
        priority: 'Medium',
        date: '',
    },
    {
        id: 1,
        title: "What ? ",
        description: "dont know what to do..",
        category: "inProgress",
        heading: "Technical Task",
    },
    {
        id: 2,
        title: "S234524",
        description: "adsöfljasödfasdf",
        category: "AwaitFeedback",
        heading: "User Story",
    },
    {
        id: 3,
        title: "Start blabla",
        description: " testin bla bla",
        category: "Done",
        heading: "Technical Task",
    },
];

function boardInit() {
    renderTodos();
}

function renderTodos() {
    clearHTML();

    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        let containerId = "";

        if (todo.category === "toDo") {
            containerId = "toDo";
        } else if (todo.category === "inProgress") {
            containerId = "inProgress";
        } else if (todo.category === "AwaitFeedback") {
            containerId = "AwaitFeedback";
        } else if (todo.category === "Done") {
            containerId = "Done";
        }

        createHTML(todo, containerId);
    }
}

function clearHTML() {
    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("AwaitFeedback").innerHTML = "";
    document.getElementById("Done").innerHTML = "";
}

function createHTML(todo, containerId) {
    let toDoHtml = /*html*/ `
    <div class="board-content"> 
        <div class="board-body">
            <div class="board-task-card">
                <h3 class="btc-type ${setCategoryStyle(todo.heading)}">${todo.heading}</h3>
                <div class="btc-group">
                    <div class="btc-title">${todo.title}</div>
                    <div class="btc-description">${todo.description}</div>
                </div>
                <div class="board-task-progress-group">
                    <div class="board-task-max-bar">
                        <div class="board-task-value-bar"></div>
                    </div>
                    <div class="board-task-progress-text">1/2 Subtasks</div>
                </div>
                <div class="user-priority-group">
                    <div class="board-user-group">
                        <div class="board-card-user bcu-orange">AM</div>
                        <div class="board-card-user bcu-green">EM</div>
                        <div class="board-card-user bcu-dark-blue">MB</div>
                    </div>
                    <img src="./img/medium-board.png" alt="medium-board">
                </div>
            </div>
        </div>
    </div>
    `;

    if (containerId) {
        document.getElementById(containerId).innerHTML += toDoHtml;
    }
}


function setCategoryStyle(heading) {
    if (heading == "User Story") {
        return "btc-type-blue"
    } else if (heading == "Technical Task") {
        return "btc-type-green"
    }
}