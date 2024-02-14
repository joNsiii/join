let users = [];
let newArray = []; /* delete our backend-users-array */

async function addUser() {
    let date = new Date();
    let userId = date.getTime();
    let name = document.getElementById('username');
    let email = document.getElementById('useremail');
    let password = document.getElementById('password-type');
    if (users.find(u => name.value === u.name)) {
        return alert('Username already exist!!');
    } if (users.find(u => email.value === u.email)) {
        return alert('Email already exist!!');
    }

    let newUser = {
        'name': name.value,
        'email': email.value,
        'password': password.value,
        'contacts': [],
        'phone': '',
        'boardTasks': [],
        'userId': userId
    }
    users.push(newUser);
    await setItem('users', JSON.stringify(users));
    window.location.href = 'login.html?msg=You Signed Up successfully'
}

function checkPassword() {
    let password = document.getElementById('password-type').value;
    let confirmPassword = document.getElementById('password-type2').value;
    if (password === confirmPassword) {
        addUser();
    } else {
    //     let pInput1 = document.getElementById('password-input1');
    //     let pInput2 = document.getElementById('password-input2');

    //     pInput1.classList.add('bad-outline');
    //     pInput2.classList.add('bad-outline');
        alert('PASSWORDS ARE DIFFERENT!!!')
    }
}

function passwordValidation() {
let passwordOutline1 = document.getElementById('password-parent');
let passwordOutline2 = document.getElementById('password-input2');

if (document.getElementById('password-type').value ==
    document.getElementById('password-type2').value) {
    //Wollen wir eine grüne Outline? Wenn nein, dann bitte removen.
    passwordOutline1.classList.add('good-outline');
    passwordOutline2.classList.add('good-outline');
    document.getElementById('message').innerHTML = 'Matching!';
} else {
    document.getElementById('message').innerHTML = 'Not matching';
    passwordOutline1.classList.add('bad-outline');
    passwordOutline2.classList.add('bad-outline');

    //Green-Outline 2.
    passwordOutline1.classList.remove('good-outline');
    passwordOutline2.classList.remove('good-outline');
}

if (document.getElementById('password-type').value == '' &&
    document.getElementById('password-type2').value == '') {
    passwordOutline1.classList.remove('good-outline');
    passwordOutline2.classList.remove('good-outline');
    //Green-Outline 3.
    passwordOutline1.classList.remove('bad-outline');
    passwordOutline2.classList.remove('bad-outline');
    document.getElementById('message').innerHTML = '';
    }


}

document.querySelectorAll('input[type="password"]').forEach(passwordField => {
    passwordField.addEventListener('input', togglePassword);
});

document.querySelectorAll('input[type="password"]').forEach(passwordField => {
    let toggleImg = passwordField.nextElementSibling.querySelector('img');
    toggleImg.addEventListener('click', function () {
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