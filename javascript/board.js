let boardTasks = [
    {
        'id': 0,
        'category': 'in-progress',
        'type': 'User Story',
        'title': 'Kochwelt Page & Recipe Recommender',
        'description': 'Build start page with recipe recommendation...',
        'subtasks': [1, 2],
        'members': ['AM', 'EM', 'MB'],
        'bgc': ['orange', 'green', 'dark-blue'],
        'priority': './img/medium-board.png'
    },
    {
        'id': 1,
        'category': 'in-progress',
        'type': 'User Story',
        'title': 'Contact Form & Imprint',
        'description': 'Create a contact form and imprint page...',
        'subtasks': [1, 2],
        'members': ['AS', 'DE', 'EF'],
        'bgc': ['orange', 'green', 'dark-blue'],
        'priority': './img/urgent-board.png'
    }
];

let currentDraggedElement;


function updateBoard() {
    renderTaskCategory('to-do');
    renderTaskCategory('in-progress');
    renderTaskCategory('await-feedback');
    renderTaskCategory('done');

}


function renderTaskCategory(category) {
    let taskType = boardTasks.filter(t => t['category'] == category);
    document.getElementById(category).innerHTML = '';
    if (taskType.length < 1) {
        document.getElementById(category).innerHTML += generateTaskPlaceholder(category);
    } else {
        for (let i = 0; i < taskType.length; i++) {
            const element = taskType[i];
            document.getElementById(category).innerHTML += generateTodosHTML(element);
        }
    }
}


function generateTaskPlaceholder(category) {
    return `<div class="board-no-task">No tasks ${category.replace('-', ' ')}</div>`
}


function generateTodosHTML(element) {
    let card = element;
    return `
        <div class="board-task-card" draggable="true" ondragstart="startDragging(${element['id']})" onclick="openDialog('dialog')">
            ${renderCardType(card)}
            ${renderCardTitleDescriptionGroup(card)}
            ${renderCardSubtasks(card)}
            ${renderCardMemberPriorityGroup(card)}
        </div>
    `;
}


// Card Type Color anpassen!!!
function renderCardType(card) {
    return `<h3 class="btc-type btc-type-blue">${card.type}</h3>`;
}


function renderCardTitleDescriptionGroup(card) {
    return `
        <div class="btc-group">
            <div class="btc-title">${card.title}</div>
            <div class="btc-description">${card.description}</div>
        </div>
    `;
}


// Progess Bar bearbeiten!!!
function renderCardSubtasks(card) {
    let subtasks = card.subtasks;
    return `
        <div class="board-task-progress-group">
                <div class="board-task-max-bar">
                    <div class="board-task-value-bar"></div>
                </div>
                <div class="board-task-progress-text">${subtasks[0]}/${subtasks[1]} Subtasks</div>
        </div>
    `;
}


function renderCardMemberPriorityGroup(card) {
    return `
        <div class="user-priority-group">
            ${renderCardMemberGroup(card)}
            ${renderCardPriority(card)}
        </div>
    `;
}


function renderCardMemberGroup(card) {
    let members = card.members;
    let bgc = card.bgc;
    return `
        <div class="board-user-group">
            ${renderCardMember(members, bgc)}
        </div>
    `;
}


function renderCardMember(members, bgc) {
    let membersHTML = '';
    for (let i = 0; i < members.length; i++) {
        membersHTML += `<div class="board-card-user bcu-${bgc[i]}">${members[i]}</div>`;
    }
    return membersHTML;
}


function renderCardPriority(card) {
    return `<img src="${card.priority}" alt="medium-board">`;
}


function startDragging(id) {
    currentDraggedElement = id;
}


function allowDrop(event) {
    event.preventDefault();
}


function moveTo(category) {
    boardTasks[currentDraggedElement]['category'] = category;
    updateBoard();
}


function addhighlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}



// Bitte verschieben!!!
let boardTasksDialog = [
    {
        'type': 'User Story',
        'title': 'Kochwelt Page & Recipe Recommender',
        'description': 'Build start page with recipe recommendation.',
        'due-date': '10/05/2023',
        'priority-text': 'Medium',
        'priority-img': './img/medium-board.png',
        'members': ['Emmanuel Mauer', 'Marcel Bauer', 'Anton Mayer'],
        'members-bgc': ['green', 'dark-blue', 'blue'],
        'subtasks-state': ['./img/checkmark.png', './img/checkmark-unchecked.png'],
        'subtasks-text': ['Implement Recipe Recommendation', 'Start Page Layout']
    }
];


function renderTaskViewer(i) {
    let task = boardTasksDialog[i];
    renderBoardTaskValue(task, 'type');
    renderBoardTaskValue(task, 'title');
    renderBoardTaskValue(task, 'description');
    renderBoardTaskValue(task, 'due-date');
    renderBoardTaskPriority(task);
    renderBoardTaskMemberCollector(task);
    renderBoardTaskSubtaskGroup(task);
}


function renderBoardTaskValue(task, key) {
    let output = getElement(`board-task-${key}`);
    output.innerHTML = task[key];
}


function renderBoardTaskPriority(task) {
    let priority = getElement('board-task-priority');
    let priorityText = task['priority-text'];
    let priorityImg = task['priority-img'];
    priority.innerHTML = `
        <div id="board-task-priority" class="dbt-priority">
            ${priorityText}
            <img src="${priorityImg}" alt="prio-icon">
        </div>
    `;
}


function renderBoardTaskMemberCollector(task) {
    let memberCollector = getElement('board-task-member-collector');
    memberCollector.innerHTML = '';
    fillMemberCollector(task, memberCollector);
}


function fillMemberCollector(task, memberCollector) {
    let members = task['members'];
    let bgColors = task['members-bgc'];
    memberCollector.innerHTML += `
    <div id="board-task-members" class="dbt-collector">
            ${renderMember(members, bgColors)}
        </div>
    `;
}


function renderMember(members, bgColors) {
    let membersHTML = '';
    for (let i = 0; i < members.length; i++) {
        let member = members[i];
        let bgColor = bgColors[i];
        membersHTML += `
            <div class="dbt-contact-group">
                <div class="dbt-contact-profile dbt-${bgColor}">EM</div>
                <div class="dbt-contact-name">${member}</div>
            </div>
        `;
    }
    return membersHTML;
}


function renderBoardTaskSubtaskGroup(task) {
    let subtaskGroup = getElement('board-task-subtask-group');
    fillSubtaskGroup(task, subtaskGroup);
}


function fillSubtaskGroup(task, subtaskGroup) {
    let subtaskStates = task['subtasks-state'];
    let subtaskTexts = task['subtasks-text'];
    subtaskGroup.innerHTML = `
        ${renderSubtask(subtaskStates, subtaskTexts)}
    `;
}


function renderSubtask(subtaskStates, subtaskTexts) {
    let subtaskHTML = '';
    for (let i = 0; i < subtaskStates.length; i++) {
        let subtaskState = subtaskStates[i];
        let subtaskText = subtaskTexts[i];
        subtaskHTML += `
            <div class="dbt-subtask-group">
                <img class="dbt-subtask-img" src="${subtaskState}" alt="check-box">
                <div class="dbt-subtask-text">${subtaskText}</div>
            </div>
        `;
    }
    return subtaskHTML;
}