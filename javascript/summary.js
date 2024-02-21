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
    dayTimeGretting();
    greetUser();
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

