let checkStatus;

/**After singup u will automaticly directioned to 'login'-page and a popup 'signup successfully' will shown up */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
if (msg) {
    document.getElementById('msgPopup').classList.remove('d-none');
    msgPopup.innerHTML = msg;
    setTimeout(() => {
        msgPopup.classList.add('d-none');
    }, "6000");
}

function checkLogin() {
    let email = document.getElementById('email-field').value.toLowerCase();
    let password = document.getElementById('password-type').value;
    let loggedInUser = users.find(u => email === u.email && password === u.password);
    if (loggedInUser) {
        rememberMe();
        console.log('Login successfully');
        sessionStorage.setItem('session_token', loggedInUser.userId);
        window.location.href = 'summary.html'; 
    } else {
        wrongPassword();
    }
}

function rememberMeStatus() {
    if(checkStatus == true){
        checkStatus = false;
        console.log('unchecked')
    }else {
        checkStatus = true;
        console.log('checked')
    }
}

function rememberMe() {
    let email = document.getElementById('email-field').value;
    let password = document.getElementById('password-type').value;   
    if(checkStatus == true){
        localStorage.setItem('remember-me-email', email);
        localStorage.setItem('remember-me-password', password);
    }
}

function loadRememberMe() {
    loadCheckBoxStatus();
    let savedEmail =  localStorage.getItem('remember-me-email');
    let savedPassword = localStorage.getItem('remember-me-password');
    if(savedEmail) {
        document.getElementById('email-field').value = savedEmail;
    }
    if(savedPassword) {
        document.getElementById('password-type').value = savedPassword;
    }
}

function isKeyInLocalStorage() {
    return localStorage.getItem('remember-me-email') !== null;
}

function loadCheckBoxStatus() {
    let checkBox = document.getElementById('checkbox-remember-me');
    if(isKeyInLocalStorage()) {
        checkBox.src = "./img/checkmark_2_18x18.png";
        checkStatus = true;
    }else {
        checkBox.src = "./img/checkmark-unchecked.png";
        checkStatus = false;
    }
}

function toggleCheckboxLogin() {
    let checkBox = document.getElementById('checkbox-remember-me');
    if (checkBox.src.includes("checkmark-unchecked.png")) {
        checkBox.src = "./img/checkmark_2_18x18.png";
    } else {
        checkBox.src = "./img/checkmark-unchecked.png";
    }
}

document.getElementById('password-type').addEventListener('input', togglePasswordLogin);

function togglePasswordLogin() {
    let passwordField = document.getElementById('password-type');
    let toggleImg = document.getElementById('password-lock');
    let badOutline = document.getElementById('password-parent');
    let wrongPw = document.getElementById('wrong-pw');
    if (passwordField.value !== "") {
        toggleImg.src = "./img/visibility_off.png";
        passwordField.type = "password";
    } else {
        toggleImg.src = "./img/lock.png";
        passwordField.type = "password";
    }
    if (badOutline.classList.contains("bad-outline")) {
        badOutline.classList.remove("bad-outline");
        wrongPw.classList.add("d-none");
    }
}

function wrongPassword() {
    let warning = document.getElementById('wrong-pw');
    let input = document.getElementById('password-parent');
    if (warning.classList !== "d-none") {
        warning.classList.remove("d-none");
        input.classList.add("bad-outline");
    }
}