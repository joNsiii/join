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