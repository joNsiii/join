let checkStatus;

/**After singup u will automaticly directioned to 'login'-page and a popup 'signup successfully' will shown up */
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
    removeMobileAnimation();
}

function removeMobileAnimation() {
    if (localStorage.getItem('loginAnimationShown')) {
        localStorage.removeItem('loginAnimationShown');
    }
    if (localStorage.getItem('GreetName')) {
        localStorage.removeItem('GreetName');
    }
}

// function greetUser() {
//     let nameBox = document.getElementById('greeting-name');
//     if (currentUserData !== undefined) {
//         let fullName = currentUserData.name;
//         let spaceIndex = fullName.indexOf(' ');
//         let firstName = fullName.slice(0, spaceIndex);
//         let lastName = fullName.slice(spaceIndex + 1);
//             formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
//         let formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
//         // let formattedFullName = formattedFirstName + ' ' + formattedLastName;
//         // nameBox.innerHTML = formattedFullName;
//         console.log(formattedFirstName)
//     } else {
//         nameBox.innerHTML = 'Guest';
//     }
// }

function checkLogin() {
    let email = document.getElementById('email-field').value.toLowerCase();
    let password = document.getElementById('password-type').value;
    let loggedInUser = users.find(u => email === u.email && password === u.password);
    if (loggedInUser) {
        rememberMe();
        localStorage.removeItem('userId'); 
        setCookie('user_session_token', loggedInUser.userId, 24);
        window.location.href = 'summary.html?login=true';
        console.log(loggedInUser)
        localStorage.setItem('userId', loggedInUser.userId); 
        localStorage.setItem("GreetName", loggedInUser.name);
        greetUser()
    } else {
        wrongPassword();
    }
}

function guestLogin() {
    setCookie('guest_session_token', 'guest', 24);
    window.location.href = 'summary.html?login=true';
    localStorage.setItem("GreetName", "Guest ");
}

function rememberMeStatus() {
    if (checkStatus == true) {
        checkStatus = false;
        console.log('unchecked')
    } else {
        checkStatus = true;
        console.log('checked')
    }
}

function rememberMe() {
    let email = document.getElementById('email-field').value;
    let password = document.getElementById('password-type').value;
    if (checkStatus == true) {
        localStorage.setItem('remember-me-email', email);
        localStorage.setItem('remember-me-password', password);
    }
}

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

function isKeyInLocalStorage() {
    return localStorage.getItem('remember-me-email') !== null;
}

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

document.querySelectorAll('input[type="password"]').forEach(passwordField => {
    let toggleImg = passwordField.nextElementSibling.querySelector('img');
    toggleImg.addEventListener('click', function () {
        togglePasswordIcon(passwordField, toggleImg);
    });
});

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

function loadLogoAnimation() {
    const logo = document.querySelector('.joinLogo');
    const startup = document.querySelector('.startup');

    setTimeout(function () {
        logo.classList.add('selected');
    }, 1000);

    setTimeout(function () {
        startup.classList.add('blend-out');
    }, 1250);

    setTimeout(function () {
        startup.classList.add('d-none');
    }, 1350);
}