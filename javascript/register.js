let users = [];


document.querySelectorAll('input[type="password"]').forEach(passwordField => {
    passwordField.addEventListener('input', togglePassword);
});

document.querySelectorAll('input[type="password"]').forEach(passwordField => {
    let toggleImg = passwordField.nextElementSibling.querySelector('img');
    toggleImg.addEventListener('click', function() {
        togglePasswordIcon(passwordField, toggleImg);
    });
});

function togglePassword() {
    let passwordField = this;
    let toggleImg = passwordField.nextElementSibling.querySelector('img');

    if (passwordField.value !== "") {
        toggleImg.src = "./img/visibility_off.png";
        passwordField.type = "password";
    } else {
        toggleImg.src = "./img/lock.png";
        passwordField.type = "password";
    }
}

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