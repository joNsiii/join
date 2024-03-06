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

/**
 * Changing image on mouseover
 */
function changeImage() {
    document.getElementById('edit-img').src = 'img/edit-bg-white.png';
}
/**
 * Changing image on mouseleave
 */
function changeImageBack() {
    document.getElementById('edit-img').src = 'img/edit-bg-blue.png';
}
/**
 * Changing image on mouseover
 */
function changeImage1() {
    document.getElementById('success-img').src = 'img/success-bg-white.png';
}
/**
 * Changing image on mouseleave
 */
function changeImageBack1() {
    document.getElementById('success-img').src = 'img/success-bg-blue.png';
}

/**
 * Checking URL parameter after loginscreen. If true mobilLoginScreen() will be fired
 */
window.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const loginFlag = urlParams.get('login');
    if (loginFlag === 'true') {
        await loadUsers();
        await loadUserData();
        mobilLoginScreen();
    }
})

/**
 * Removing d-none from mobile greet container and greeting user in mobile version for 2 seconds
 */
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

/**
 * If the window reached more than 730px dayTimeGretting() and greetUser() will be fired again
 */
window.addEventListener('resize', function () {
    let windowWidth = window.innerWidth;
    let actionWidth = 730;
    if (windowWidth >= actionWidth) {
        dayTimeGretting();
        greetUser();
    }
});

/**
 * Greeting the user depending on daytime
 */
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

/**
 * The function will fired depending on window width
 */
function greetUser() {
    if (window.innerWidth <= 730) {
        document.getElementById('greeting-name-mobile').innerHTML = checkForValidUser();
    } else {
        document.getElementById('greeting-name').innerHTML = checkForValidUser();
    }
}

/**
 * checking if user or guest
 * 
 * @returns name of the user or guest
 */
function checkForValidUser() {
    if (currentUserData !== undefined) {
        return currentUserData.name; 
    } else {
        return 'Guest';
    }
}

/**
 * Counter for all available tasks
 */
function loadTaskCounter() {
    let allTask = document.getElementById('task-in-boards');
    allTask.innerHTML = '';
    allTask.innerHTML = boardTasks.length;
}

/**
 * Counter all tasks for each category
 */
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

/**
 * Displaying counter for todo´s
 * 
 * @param {variable} toDo - This is a variable for a category
 */
function toDoCounter(toDo) {
    let toDoBox = document.getElementById('todo-counter');
    if (toDo == undefined) {
        toDo = 0;
    }
    toDoBox.innerHTML = '';
    toDoBox.innerHTML = toDo;
}

/**
 * Displaying counter for inProgress
 * 
 * @param {variable} inProgress - This is a variable for a category
 */
function taskInProgress(inProgress) {
    let inProgressBox = document.getElementById('task-in-progress');
    if (inProgress == undefined) {
        inProgress = 0;
    }
    inProgressBox.innerHTML = '';
    inProgressBox.innerHTML = inProgress;
}

/**
 * Displaying counter for done
 * 
 * @param {variable} done - This is a variable for a category
 */
function taskInDone(done) {
    let doneBox = document.getElementById('done-counter');
    if (done == undefined) {
        done = 0;
    }
    doneBox.innerHTML = '';
    doneBox.innerHTML = done;
}

/**
 * Displaying counter for awaitFeedback
 * 
 * @param {variable} awaitFeedback - This is a variable for a category
 */
function taskInAwaitFeedback(awaitFeedback) {
    let awaitFeedbackBox = document.getElementById('task-in-await-feedback');
    if (awaitFeedback == undefined) {
        awaitFeedback = 0;
    }
    awaitFeedbackBox.innerHTML = '';
    awaitFeedbackBox.innerHTML = awaitFeedback;
}

/**
 * Counter for urgenttask
 */
function urgentTaskCounter() {
    let urgentBox = document.getElementById('urgent-counter');
    let urgentTasks = boardTasks.filter(task => task.priority === 'Urgent');
    let urgentTasksCount = urgentTasks.length;
    urgentBox.innerHTML = urgentTasksCount;
    urgentDeadline(urgentTasks);
}

/**
 * Searching for the closest deadline in all urgenttasks
 * 
 * @param {variable} urgentTasks - This is the task with "urgent"- priority
 */
function urgentDeadline(urgentTasks) {
    let dateBox = document.getElementById('urgent-date');
    let closestDeadline = null;
    for (let task of urgentTasks) {
        let deadline = new Date(task.dueDate);
        if (!closestDeadline || deadline < closestDeadline) {
            closestDeadline = deadline;
            dateBox.innerHTML = '';
            dateBox.innerHTML = deadline.toLocaleDateString();
        }
    }
}