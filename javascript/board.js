let boardTasks = [
    {
        taskId: 0,
        title: "Start with JS",
        description: "create reusable HTML base templates...",
        category: "toDo",
        heading: "Technical Task",
        subtasks: [
            {
                subtaskId: 0,
                subtasksText: "subtasks Text for checked unchecked",
                isChecked: false,
            },
        ],
        sub_users: [
            {
                userId: 0,
                userFirstname: "Anton",
                userSurname: "Müller",
                userBackgroundColor: "green",
            },
        ],
        priority: "Medium",
        date: "15/02/2024",
    },
    {
        taskId: 1,
        title: "What ? ",
        description: "dont know what to do..",
        category: "inProgress",
        heading: "Technical Task",
        subtasks: ["i do have to test this", "second subtask for testing"],
        sub_users: [
            {
                userId: 0,
                userFirstname: "Anton",
                userSurname: "Müller",
                userBackgroundColor: "green",
            },
            {
                userId: 1,
                userFirstname: "Oumout",
                userSurname: "Resit",
                userBackgroundColor: "blue",
            },
        ],
        priority: "Medium",
        date: "09/08/2023",
    },
    {
        taskId: 2,
        title: "S234524",
        description: "adsöfljasödfasdf",
        category: "AwaitFeedback",
        heading: "User Story",
        subtasks: [],
        sub_users: [],
        priority: "Urgent",
        date: "25/02/2023",
    },
    {
        taskId: 3,
        title: "Start blabla",
        description: " testin bla bla",
        category: "Done",
        heading: "Technical Task",
        subtasks: [],
        sub_users: [],
        priority: "Low",
        date: "15/05/2023",
    },
    {
        taskId: 4,
        title: "Funny Storys",
        description: "THIS IS FUNNY!!",
        category: "toDo",
        heading: "User Story",
        subtasks: [],
        sub_users: [],
        priority: "Urgent",
        date: "26/11/2023",
    },
];

function boardInit() {
    renderTodos();
}

function renderTodos() {
    clearHTML();

    for (let i = 0; i < boardTasks.length; i++) {
        const task = boardTasks[i];
        let containerId = "";

        if (task.category === "toDo") {
            containerId = "toDo";
        } else if (task.category === "inProgress") {
            containerId = "inProgress";
        } else if (task.category === "AwaitFeedback") {
            containerId = "AwaitFeedback";
        } else if (task.category === "Done") {
            containerId = "Done";
        }

        createHTML(task, containerId);
    }
}

function clearHTML() {
    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("AwaitFeedback").innerHTML = "";
    document.getElementById("Done").innerHTML = "";
}

function createHTML(task, containerId) {
    let userInitialsHtml = generateUserInitialsHtml(task.sub_users);

    let toDoHtml = /*html*/ `
    <div class="board-content" onclick="openDetails(${task.taskId})"> 
        <div class="board-body">
            <div class="board-task-card">
                <h3 class="btc-type ${setCategoryStyle(task.heading)}">${task.heading}</h3>
                <div class="btc-group">
                    <div class="btc-title">${task.title}</div>
                    <div class="btc-description">${task.description}</div>
                </div>
                <div class="board-task-progress-group">
                    <div class="board-task-max-bar">
                        <div class="board-task-value-bar"></div>
                    </div>
                    <div class="board-task-progress-text">1/2 Subtasks</div>
                </div>
                <div class="user-priority-group">
                    <div class="board-user-group">
                        ${userInitialsHtml}
                    </div>
                    ${showPriority(task)}
                </div>
            </div>
        </div>
    </div>
    `;
    if (containerId) {
        document.getElementById(containerId).innerHTML += toDoHtml;
    }
}

// overlay html
function insertTodoDataIntoDialog(task, dialog) {
    const title = dialog.querySelector(".dbt-title");
    const description = dialog.querySelector(".dbt-description");
    const priority = dialog.querySelector(".dbt-priority");
    const date = dialog.querySelector(".dbt-date");
    const subtask = dialog.querySelector(".dbt-collector");
    const subUsersNames = generateSubUsersHtml(task.sub_users);

    title.innerText = task.title;
    description.innerText = task.description;
    priority.innerHTML = task.priority + showPriority(task);
    date.innerHTML = task.date;
    subtask.innerHTML = subUsersNames;
}

function generateSubUsersHtml(subUsers) {
    let subUserNamesHtml = "";

    if (subUsers && subUsers.length > 0) {
        subUsers.forEach((user) => {
            const initials = `${user.userFirstname.charAt(0).toUpperCase()}${user.userSurname.charAt(0).toUpperCase()}`;
            const fullName = `${user.userFirstname} ${user.userSurname}`;
            subUserNamesHtml += /*html*/ `
                <div class="dbt-contact-group">
                        <div class="dbt-contact-profile dbt-${user.userBackgroundColor}">${initials}</div>
                        <div class="dbt-contact-name">${fullName}</div>
                </div>
            `;
        });
    } else {
        subUserNamesHtml = '<div class="dbt-contact-name">No users assigned</div>';
    }
    return subUserNamesHtml;
}

async function openDetails(taskId) {
    const task = boardTasks.find((task) => task.taskId === taskId);

    if (!task) {
        console.error("Todo item not found");
        return;
    }
    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./templates/board-overlay-blue.html");

    await includeHTML();
    insertTodoDataIntoDialog(task, dialog);
    dialog.showModal();

    setupCloseDialogMechanism();
}

// Help functions
function showPriority(task) {
    if (task.priority === "Urgent") {
        return '<img src="./img/urgent-board.png"></img>';
    } else if (task.priority === "Medium") {
        return '<img src="./img/medium-board.png"></img>';
    } else if (task.priority === "Low") {
        return '<img src="./img/low-board.png"></img>';
    }
}

function setCategoryStyle(heading) {
    if (heading == "User Story") {
        return "btc-type-blue";
    } else if (heading == "Technical Task") {
        return "btc-type-green";
    }
}

function generateUserInitialsHtml(subUsers) {
    let userInitialsHtml = "";
    for (let user of subUsers) {
        const initials = `${user.userFirstname.charAt(0).toUpperCase()}${user.userSurname.charAt(0).toUpperCase()}`;
        userInitialsHtml += `<div class="board-card-user bcu-${user.userBackgroundColor}">${initials}</div>`;
    }
    return userInitialsHtml;
}

function setupCloseDialogMechanism() {
    const dialogBoardTask = document.querySelector(".dialog-board-task");
    const dialog = document.getElementById("dialog");

    dialog.addEventListener("click", function (event) {
        closeDialog("dialog");
    });

    // prevent closing dialog if element itself is clicked
    dialogBoardTask.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}
