let currentUserData = [];

function redirectToPreviousPage() {
    location.href = document.referrer;
    return false;
}

function isLoggedIn() {
    const sessionToken = localStorage.getItem('session_token');
    return sessionToken !== null;
}

async function loadAllData() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading Users Data:', e);
    }
    loadUserData();
}

function loadUserData() {
    let userId = localStorage.getItem('session_token');
    console.log(userId);
    let userData = users.find(u => u.id === userId);

    if (userData) {
        currentUserData.push(userData);
        console.log('Current user data:', currentUserData);
    }
 
}

window.addEventListener('DOMContentLoaded', function () {
    if (isLoggedIn()) {
        loadAllData();
        console.log('User is logged in');

    } else {
        console.log('User is not logged in');
    }
});

