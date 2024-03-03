let users = [];
let newArray = []; /* delete our backend-users-array */

/**
 * adding new user to users-array if name and email not existing
 * 
 * @returns alert if name or email already in use
 */
function addUser() {
    registerBtn.disabled = true;
    let date = new Date();
    let userId = date.getTime();
    let name = document.getElementById('username');
    let email = document.getElementById('useremail');
    let password = document.getElementById('password-type');
    let initials = userInitials(name.value);
    if (users.find(u => name.value === u.name)) {
        return alert('Username already exist!!');
    } if (users.find(u => email.value === u.email)) {
        return alert('Email already exist!!');
    }
    saveAsObject(name, email, password, initials, userId);
    resetButton();
    window.location.href = 'login.html?msg=You Signed Up successfully';
}

/**
 * creating a new object in users-array // clearing localStorage if rememberme is set // add localStorage to show new signed up user-email after redirected to login.html
 * 
 * @param {string} name - userinput
 * @param {string} email - userinput
 * @param {string} password - userinput
 * @param {string} initials - will automaticlly created from username
 * @param {number} userId - will automaticlly created from actual date and time
 */
async function saveAsObject(name, email, password, initials, userId) {
    let newUser = {
        'name': name.value,
        'email': email.value,
        'password': password.value,
        'contacts': [],
        'phone': '',
        'initials': initials,
        'userId': userId,
        'bgc-name': 'orange',
        'bgc-code': '#FF7A00'
    }
    users.push(newUser);
    localStorage.clear('remember-me-email');
    localStorage.clear('remember-me-password');
    localStorage.setItem('email', email.value);
    await setItem('users', JSON.stringify(users));
}

/**
 * reset button 
 */
function resetButton() {
    registerBtn.disabled = false;
}

/**
 * Checking for the same password in both inputfields and returning green color if matching and red color if not
 */
function passwordValidation() {
    let passwordOutline1 = document.getElementById('password-parent');
    let passwordOutline2 = document.getElementById('password-input2');
    if (document.getElementById('password-type').value ==
        document.getElementById('password-type2').value) {
        passwordOutline1.classList.add('good-outline');
        passwordOutline2.classList.add('good-outline');
        document.getElementById('message').innerHTML = '';
    } else {
        document.getElementById('message').innerHTML = 'Ups! Your password\'s don\'t match';
        passwordOutline1.classList.add('bad-outline');
        passwordOutline2.classList.add('bad-outline');
        passwordOutline1.classList.remove('good-outline');
        passwordOutline2.classList.remove('good-outline');
    }
    if (document.getElementById('password-type').value == '' &&
        document.getElementById('password-type2').value == '') {
        passwordOutline1.classList.remove('good-outline');
        passwordOutline2.classList.remove('good-outline');
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

/**
 * toogle the type of the inputfield
 */
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
};

/**
 * toggle image in password input to hide or show the input
 * 
 * @param {variable} passwordField - passwordfield input
 * @param {img} toggleImg - image in passwordfield
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

/**
 * Showing red border in inputfield if password is wrong
 */
function wrongPassword() {
    let warning = document.getElementById('wrong-pw');
    let input = document.getElementById('password-parent');

    if (warning.classList !== "d-none") {
        warning.classList.remove("d-none");
        input.classList.add("bad-outline");
    }
};
