let users = [];



async function addUser() {
    let date = new Date();
    let userId = date.getTime();
    let newArray = []; /* delete our backend-users-array */
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
        'id': userId
    }
    users.push(newUser);
    // window.location.href = 'login.html?msg=You Signed Up successfully'

    setItem('users', users);
}

function checkPassword() {
    let password = document.getElementById('password-type').value;
    let confirmPassword = document.getElementById('password-type2').value;
    if (password === confirmPassword) {
        addUser();
    } else {
        alert('PASSWORDS ARE DIFFERENT!!!')
    }
}