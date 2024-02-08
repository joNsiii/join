let users = [];

async function addUser() {

    let name = document.getElementById('username');
    let email = document.getElementById('useremail');
    let password = document.getElementById('password-type');
    if(users.find(u => name.value === u.name)) {
        return alert('Username already exist!!')    
    }if(users.find(u => email.value === u.email)) {
        return alert('Email already exist!!')    
    }
    users.push({name: name.value, email: email.value, password: password.value})
    window.location.href = 'login.html?msg=You Signed Up successfully'
}

function checkPassword() {
    let password = document.getElementById('password-type').value;
    let confirmPassword = document.getElementById('password-type2').value;
    if(password === confirmPassword) {
        addUser();
    }else {
        alert('PASSWORDS ARE DIFFERENT!!!')
    }
}