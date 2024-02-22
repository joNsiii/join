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

async function summaryInit() {
    await loadUsers();
    await loadUserData();
    await loadTasksInBoard();
    loadTaskCounter();
    dayTimeGretting();
    greetUser();
    taskInCategory();
}

function dayTimeGretting() {
    let greet = [
        'What are you doing that early?',
        'Good Morning',
        'Good Afternoon',
        'Good Evening'
    ][parseInt(new Date().getHours() / 24 * 4)];
    document.getElementById('daytime-greet').innerHTML = greet + ',';
}

function greetUser() {
    let nameBox = document.getElementById('greeting-name');
    if (currentUserData !== undefined) {
        let fullName = currentUserData.name;
        let spaceIndex = fullName.indexOf(' ');
        let firstName = fullName.slice(0, spaceIndex);
        let lastName = fullName.slice(spaceIndex + 1);
        let formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        let formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
        let formattedFullName = formattedFirstName + ' ' + formattedLastName;
        nameBox.innerHTML = formattedFullName;
    } else {
        nameBox.innerHTML = 'Guest';
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
        console.log(newCounter[value]);
        // let toDo = newCounter['toDo'];
        // let inProgress = newCounter['inProgress'];
        // let awaitFeedback = newCounter['awaitFeedback'];
        // let done = newCounter['done'];
        // toDoCounter(toDo);
        // taskInProgress(inProgress);
        // taskInDone(done);
        // taskInAwaitFeddback(awaitFeedback);
    }  
}

function toDoCounter(toDo) {
    let counter = document.getElementById('todo-counter');
    counter.innerHTML = '';
    counter.innerHTML = toDo;
}

function taskInProgress(inProgress) {
    let counter = document.getElementById('task-in-progress');
    counter.innerHTML = '';
    counter.innerHTML = inProgress;
}

function taskInDone(done) {
    let counter = document.getElementById('done-counter');
    counter.innerHTML = '';
    counter.innerHTML = done;
}

function taskInAwaitFeddback(awaitFeedback) {
    let counter = document.getElementById('task-in-await-feedback');
    counter.innerHTML = '';
    counter.innerHTML = awaitFeedback;
}