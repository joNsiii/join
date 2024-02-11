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
        subtasks: ["i do have to test this", "second subtask for testing"],
        sub_users: [],
        priority: 'Medium',
        date: '',
    },
    {
        id: 2,
        title: "S234524",
        description: "adsöfljasödfasdf",
        category: "AwaitFeedback",
        heading: "User Story",
        subtasks: [],
        sub_users: [],
        priority: 'Urgent',
        date: '',
    },
    {
        id: 3,
        title: "Start blabla",
        description: " testin bla bla",
        category: "Done",
        heading: "Technical Task",
        subtasks: [],
        sub_users: [],
        priority: 'Low',
        date: '',
    },
    {
        id: 4,
        title: "Funny Storys",
        description: "THIS IS FUNNY!!",
        category: "toDo",
        heading: "User Story",
        subtasks: [],
        sub_users: [],
        priority: 'Urgent',
        date: '',
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
    <div class="board-content" onclick="openDetails(${todo.id})"> 
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
                    ${showPriority(todo)}
                </div>
            </div>
        </div>
    </div>
    `;
    if (containerId) {
        document.getElementById(containerId).innerHTML += toDoHtml;
    }
}

function closeBoardOverlay() {
    const dialog = document.querySelector('dialog');
    if (dialog) {
        dialog.close()
    }
}

async function openDetails(id) {
    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        console.error('Todo item not found');
        return;
    }
    const dialog = document.getElementById('dialog');
    dialog.setAttribute('w3-include-html', './templates/board-overlay-blue.html');

    await includeHTML();
    insertTodoDataIntoDialog(todo, dialog);
    dialog.showModal();
}

function insertTodoDataIntoDialog(todo, dialog) {
    const title = dialog.querySelector('.dbt-title');
    const description = dialog.querySelector('.dbt-description');
    const priority = dialog.querySelector('.dbt-priority');


    title.innerText = todo.title;
    description.innerText = todo.description;
    priority.innerHTML = todo.priority + showPriority(todo);
}

function showPriority(todo) {
    if (todo.priority === "Urgent") {
        return '<img src="./img/urgent-board.png"></img>'
    } else if (todo.priority === "Medium") {
        return '<img src="./img/medium-board.png"></img>'
    } else if (todo.priority === "Low") {
        return '<img src="./img/low-board.png"></img>'
    }
}

function setCategoryStyle(heading) {
    if (heading == "User Story") {
        return "btc-type-blue"
    } else if (heading == "Technical Task") {
        return "btc-type-green"
    }
}