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

// function checkGreeting() {
//     let greetingName = document.getElementById('greeting-name'); 
//     if (greetingName) {
//         dayTimeGretting();
//         greetUser();
//     }
// }

function summaryInit() {
    dayTimeGretting();
    greetUser();
}

function dayTimeGretting() {
    let greet = [
        'What are you doing that early?',
        'Good Morning',
        'Good Afternoon',
        'Good Evening'
      ][ parseInt(new Date().getHours() / 24 * 4) ];
      document.getElementById('daytime-greet').innerHTML = greet + ',';
}

function greetUser() {
    let nameBox = document.getElementById('greeting-name'); 
    if(currentUserData !== undefined) {
        nameBox.innerHTML = currentUserData.name;
    }else {
        nameBox.innerHTML = 'Guest';
    }
}
