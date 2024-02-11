document.getElementById('password-type').addEventListener('input', togglePassword);

function togglePassword() {
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

function togglePasswordIcon() {
    let passwordField = document.getElementById('password-type');
    let toggleImg = document.getElementById('password-lock');
    let currentType = passwordField.type;
    if (passwordField.value !== "") {
        passwordField.type = (currentType === "password") ? "text" : "password";

        toggleImg.src = (currentType === "password") ? "./img/visibility.png" : "./img/visibility_off.png";
    } else {
        toggleImg.src = "./img/lock.png";
        passwordField.type = "password";
    }
}

function toggleCheckbox() {
    let checkBox = document.getElementById('checkbox-remember-me');

    if (checkBox.src.includes("checkmark-unchecked.png")) {
        checkBox.src = "./img/checkmark_2_18x18.png";
    } else {
        checkBox.src = "./img/checkmark-unchecked.png";
    }
}

function login() {
    let warning = document.getElementById('wrong-pw');
    let input = document.getElementById('password-parent');

    if (warning.classList !== "d-none") {
        warning.classList.remove("d-none");
        input.classList.add("bad-outline");
    }
}

/**After singup u will automaticly directioned to 'login'-page and a popup 'signup successfully' will shown up */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
if (msg) {
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
        console.log('Login successfully');
        localStorage.setItem('session_token', loggedInUser.id);
        window.location.href = 'summary.html';
    } else {
        console.log('Login failed. Incorrect email or password.');
    }
}
