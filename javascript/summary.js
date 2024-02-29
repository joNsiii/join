let greet = [];
let formattedFirstName = '';

async function summaryInit() {
    await loadUsers();
    await loadUserData();
    await loadTasksInBoard();
    dayTimeGretting();
    // greetUser();
    loadTaskCounter();
    taskInCategory();
    urgentTaskCounter();
}

function changeImage() {
    let editImg = document.getElementById('edit-img');
    editImg.src = 'img/edit-bg-white.png'
}
function changeImageBack() {
    let editImg = document.getElementById('edit-img');
    editImg.src = 'img/edit-bg-blue.png'
}

function changeImage1() {
    let successImage = document.getElementById('success-img');
    successImage.src = 'img/success-bg-white.png';
}
function changeImageBack1() {
    let successImage = document.getElementById('success-img');
    successImage.src = 'img/success-bg-blue.png'
}

function dayTimeGretting() {
    return new Promise((resolve) => {
        greet = [
        'What are you doing that early?',
        'Good Morning',
        'Good Afternoon',
        'Good Evening'
    ][parseInt(new Date().getHours() / 24 * 4)];
        resolve()
    });
}

// function greetUser() {
//     let nameBox = document.getElementById('greeting-name');
//     if (currentUserData !== undefined) {
//         let fullName = currentUserData.name;
//         let spaceIndex = fullName.indexOf(' ');
//         let firstName = fullName.slice(0, spaceIndex);
//         let lastName = fullName.slice(spaceIndex + 1);
//             formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
//         let formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
//         let formattedFullName = formattedFirstName + ' ' + formattedLastName;
//         nameBox.innerHTML = formattedFullName;
//         console.log(formattedFirstName)
//     } else {
//         nameBox.innerHTML = 'Guest';
//     }
// }

window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const loginFlag = urlParams.get('login');

    if (loginFlag === 'true' && !localStorage.getItem('loginAnimationShown')) {
        Promise.all([dayTimeGretting()])
        .then(() => {
            localStorage.setItem('loginAnimationShown', true);
            mobilLoginScreen()
        })
    }
});

function mobilLoginScreen() {
    if (window.innerWidth <= 730) {
        let greetContainer = document.getElementById('greet-popup');
        renderMobileUser(greetContainer);
        greetContainer.classList.remove('mobile-greet-animation');
        greetContainer.classList.remove('d-none');
        setTimeout(() => {
            greetContainer.classList.add('mobile-greet-animation');
        }, 1500);
        setTimeout(() => {
            greetContainer.classList.add('d-none');
        }, 3500);
    }
}

function renderMobileUser(greetContainer) {
    let fullName = localStorage.getItem("GreetName");
    let spaceIndex = fullName.indexOf(' ');
    let firstName = fullName.slice(0, spaceIndex);
    greetContainer.innerHTML += `
    <div class="summary-greeting-container-popup">
        <span class="summary-daytime-container" id="daytime-greet">${greet},</span>
        <span class="summary-name-container" id="greeting-name">${firstName}</span>
    </div>`;
}

function loadTaskCounter() {
    let allTask = document.getElementById('task-in-boards');
    allTask.innerHTML = '';
    allTask.innerHTML = boardTasks.length;
}

function taskInCategory() {
    newCounter = {};
    for (task of boardTasks) {

        let value = task['category'];
        newCounter[value] = boardTasks.filter(c => c['category'] == value).length;
    }
    let toDo = newCounter['toDo'];
    let inProgress = newCounter['inProgress'];
    let awaitFeedback = newCounter['awaitFeedback'];
    let done = newCounter['done'];
    toDoCounter(toDo);
    taskInProgress(inProgress);
    taskInDone(done);
    taskInAwaitFeedback(awaitFeedback);
}

function toDoCounter(toDo) {
    let toDoBox = document.getElementById('todo-counter');
    if (toDo == undefined) {
        toDo = 0;
    }
    toDoBox.innerHTML = '';
    toDoBox.innerHTML = toDo;
}

function taskInProgress(inProgress) {
    let inProgressBox = document.getElementById('task-in-progress');
    if (inProgress == undefined) {
        inProgress = 0;
    }
    inProgressBox.innerHTML = '';
    inProgressBox.innerHTML = inProgress;
}

function taskInDone(done) {
    let doneBox = document.getElementById('done-counter');
    if (done == undefined) {
        done = 0;
    }
    doneBox.innerHTML = '';
    doneBox.innerHTML = done;
}

function taskInAwaitFeedback(awaitFeedback) {
    let awaitFeedbackBox = document.getElementById('task-in-await-feedback');
    if (awaitFeedback == undefined) {
        awaitFeedback = 0;
    }
    awaitFeedbackBox.innerHTML = '';
    awaitFeedbackBox.innerHTML = awaitFeedback;
}

function urgentTaskCounter() {
    let urgentBox = document.getElementById('urgent-counter');
    let urgentTasks = boardTasks.filter(task => task.priority === 'Urgent');
    let urgentTasksCount = urgentTasks.length;
    urgentBox.innerHTML = urgentTasksCount;
    urgentDeadline(urgentTasks);
}

function urgentDeadline(urgentTasks) {
    let dateBox = document.getElementById('urgent-date');
    let closestDeadline = null;
    for (let task of urgentTasks) {
        let deadline = new Date(task.date);
        if (!closestDeadline || deadline < closestDeadline) {
            closestDeadline = deadline;
            dateBox.innerHTML = '';
            dateBox.innerHTML = deadline.toLocaleDateString();
        }
    }
}