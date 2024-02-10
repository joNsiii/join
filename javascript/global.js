
function redirectToPreviousPage() {
    location.href = document.referrer;
    return false;
}

function isLoggedIn() {
    const sessionToken = localStorage.getItem('session_token');
    return sessionToken !== null;
}

window.addEventListener('DOMContentLoaded', function() {
    if(isLoggedIn()) {
        console.log('User is logged in');
    }else {
        console.log('User is not logged in');
    }
});
