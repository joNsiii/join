async function summaryInit() {
    await loadUsers();
    await loadUserData();
    await loadTasksInBoard();
    dayTimeGretting();
    greetUser();
    loadTaskCounter();
    taskInCategory();
    urgentTaskCounter();
}

function changeImage() {
    document.getElementById('edit-img').src = 'img/edit-bg-white.png';
}
function changeImageBack() {
    document.getElementById('edit-img').src = 'img/edit-bg-blue.png';
}
function changeImage1() {
    document.getElementById('success-img').src = 'img/success-bg-white.png';
}
function changeImageBack1() {
    document.getElementById('success-img').src = 'img/success-bg-blue.png';
}

window.addEventListener('resize', function () {
    let windowWidth = window.innerWidth;
    let actionWidth = 730;
    if (windowWidth >= actionWidth) {
        dayTimeGretting();
        greetUser();
    }
});

function dayTimeGretting() {
    greet = [
        'What are you doing that early?',
        'Good Morning',
        'Good Afternoon',
        'Good Evening'
    ][parseInt(new Date().getHours() / 24 * 4)];
    if (window.innerWidth <= 730) {
        document.getElementById('daytime-greet-mobile').innerHTML = greet + ',';
    } else {
        document.getElementById('daytime-greet').innerHTML = greet + ',';
    }
};

function greetUser() {
    if (window.innerWidth <= 730) {
        document.getElementById('greeting-name-mobile').innerHTML = formatUserName();
    } else {
        document.getElementById('greeting-name').innerHTML = formatUserName();
    }
}

function formatUserName() {
    if (currentUserData !== undefined) {
        let fullName = currentUserData.name;
        let spaceIndex = fullName.indexOf(' ');
        let firstName = fullName.slice(0, spaceIndex);
        let lastName = fullName.slice(spaceIndex + 1);
        let formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        let formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
        let formattedFullName = formattedFirstName + ' ' + formattedLastName;
        return formattedFullName;
    } else {
        return 'Guest';
    }
}

window.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const loginFlag = urlParams.get('login');
    if (loginFlag === 'true') {
        await loadUsers();
        await loadUserData();
        mobilLoginScreen();
    }
})

function mobilLoginScreen() {
    if (window.innerWidth <= 730) {
        let greetContainer = document.getElementById('greet-popup');
        greetContainer.classList.remove('d-none');
        dayTimeGretting();
        greetUser();
        setTimeout(() => {
            greetContainer.classList.add('d-none');
        }, 2000);
    }
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