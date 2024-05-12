let checkStatus;

/**
 * After singup u will automaticly directioned to 'login'-page and a popup 'signup successfully' will shown up
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const popup = urlParams.get('greet-popup');
if (msg) {
    document.getElementById('msgPopup').classList.remove('d-none');
    msgPopup.innerHTML = msg;
    setTimeout(() => {
        msgPopup.classList.add('d-none');
    }, "6000");
}

function loginInit() {
    loadLogoAnimation();
    loadUsers();
    loadRememberMe();
    fillEmailAfterSignup();
}

/**
 * Searching for URL parameter and localStoragekey. If both true adding localStoragevalue to email-input
 */
function fillEmailAfterSignup() {
    const urlParams = new URLSearchParams(window.location.search);
    const loginFlag = urlParams.get('msg');
    if (loginFlag === 'You Signed Up successfully') {
        let email = document.getElementById('email-field');
        let userInput = localStorage.getItem('email');
        email.value = userInput;
    }
}

/**
 * Checking usersinput with serversided userdata. After login was successfully u will redirected to summary.html
 */
function checkLogin() {
    let email = document.getElementById('email-field').value.toLowerCase();
    let password = document.getElementById('password-type').value;
    let loggedInUser = users.find(u => email === u.email && password === u.password);
    if (loggedInUser) {
        localStorage.clear('email')
        rememberMe();
        setCookie('user_session_token', loggedInUser.userId, 24);
        window.location.href = 'summary.html?login=true';
    } else {
        wrongPassword();
    }
}

/**
 * set a special cookie if a guest will login
 */
function guestLogin() {
    setCookie('guest_session_token', 'guest', 24);
    window.location.href = 'summary.html?login=true';
    localStorage.setItem("GreetName", "Guest ");
}

/**
 * Checking if rememberme is checked or not
 */
function rememberMeStatus() {
    if (checkStatus == true) {
        checkStatus = false;
    } else {
        checkStatus = true;
    }
}

/**
 * Set localSorage for rememberme if the user set the rememberme checkbox
 */
function rememberMe() {
    let email = document.getElementById('email-field').value;
    let password = document.getElementById('password-type').value;
    if (checkStatus == true) {
        localStorage.setItem('remember-me-email', email);
        localStorage.setItem('remember-me-password', password);
    } else {
        localStorage.clear('remember-me-email');
        localStorage.clear('remember-me-password');
    }
}

/**
 * Checking localStorage if there is a key for rememberme.If true - autofill email and password inputfield
 */
function loadRememberMe() {
    loadCheckBoxStatus();
    let savedEmail = localStorage.getItem('remember-me-email');
    let savedPassword = localStorage.getItem('remember-me-password');
    if (savedEmail) {
        document.getElementById('email-field').value = savedEmail;
    }
    if (savedPassword) {
        document.getElementById('password-type').value = savedPassword;
        changePasswordIcon()
    }
}

/**
 * Checking for rememberme-key in localStorage
 * 
 * @returns - return value for rememberme 
 */
function isKeyInLocalStorage() {
    return localStorage.getItem('remember-me-email') !== null;
}

/**
 * Set the image for remember-checkbox
 */
function loadCheckBoxStatus() {
    let checkBox = document.getElementById('checkbox-remember-me');
    if (isKeyInLocalStorage()) {
        checkBox.src = "./img/checkmark_2_18x18.png";
        checkStatus = true;
    } else {
        checkBox.src = "./img/checkmark-unchecked.png";
        checkStatus = false;
    }
}

/**
 * toogle image for checkbox
 */
function toggleCheckboxLogin() {
    let checkBox = document.getElementById('checkbox-remember-me');
    if (checkBox.src.includes("checkmark-unchecked.png")) {
        checkBox.src = "./img/checkmark_2_18x18.png";
    } else {
        checkBox.src = "./img/checkmark-unchecked.png";
    }
}

document.getElementById('password-type').addEventListener('input', togglePasswordLogin);

/**
 * toogle image for password icon
 */
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

/**
 * set red border for passwordinput if password is wrong
 */
function wrongPassword() {
    let warning = document.getElementById('wrong-pw');
    let input = document.getElementById('password-parent');
    if (warning.classList !== "d-none") {
        warning.classList.remove("d-none");
        input.classList.add("bad-outline");
    }
}
document.querySelectorAll('input[type="password"]').forEach(passwordField => {
    let toggleImg = passwordField.nextElementSibling.querySelector('img');
    toggleImg.addEventListener('click', function () {
        togglePasswordIcon(passwordField, toggleImg);
    });
});

/**
 * toogle image for password icon
 */
function togglePasswordIcon(passwordField, toggleImg) {
    if (passwordField) {
        let currentType = passwordField.type;
        if (passwordField.value !== "") {
            passwordField.type = (currentType === "password") ? "text" : "password";
            toggleImg.src = (currentType === "password") ? "./img/visibility.png" : "./img/visibility_off.png";
        } else {
            toggleImg.src = "./img/lock.png";
            passwordField.type = "password";
        }
    }
};

function changePasswordIcon() {
    document.getElementById('password-lock').src = "./img/visibility_off.png";
}

/**
 * animate the join start logo
 */
function loadLogoAnimation() {
    const logo = document.querySelector('.joinLogo');
    const logoMobile = document.querySelector('.joinLogoWhite');
    const startup = document.querySelector('.startup');

    setTimeout(function () {
        logo.classList.add('selected');
        logoMobile.classList.add('selected');
    }, 1000);

    setTimeout(function () {
        startup.classList.add('blend-out');
    }, 1000);

    setTimeout(function () {
        startup.classList.add('d-none');
        logoMobile.classList.add('d-none')
    }, 1500);
}