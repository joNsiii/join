let isDropdownOpen = false;
let contacts = [];
let currentUserData;
let userId = sessionStorage.getItem('session_token');
boardTasks = [];

async function init() {
    await loadUsers();
    await includeHTML();
    checkForValidUser();
    loadUserData();
    loadUserImage();
    hightlightCurrentButton();
}

function checkForValidUser() {
    if (window.location.href == 'legal_notice.html' || window.location.href == 'privacy_policy.html') {
        return;
    } else {
        checkForLogin();
    }
}

function checkForLogin() {
    if (userIsLoggedIn() == false && guestIsLoggedIn() == false) {
        window.location.href = 'login.html';
    }
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function userIsLoggedIn() {
    const sessionToken = sessionStorage.getItem('session_token');
    return sessionToken !== null;
}

function guestIsLoggedIn() {
    const sessionToken = sessionStorage.getItem('guest_token');
    return sessionToken !== null;
}



function loadUserData() {
    let userId = sessionStorage.getItem('session_token');
    let userData = users.find(u => u.userId == userId);
    if (userData) {
        currentUserData = userData;
    }
}

function loadUserImage() {
    let userLogo = document.getElementById('user-initials');
    if (userIsLoggedIn()) {
        userInitials(userLogo);
    } else if (guestIsLoggedIn()) {
        guestLogo(userLogo);
    }
}

function userInitials(userLogo) {
    let initials = currentUserData.name.match(/(\b\S)?/g).join("").toUpperCase()
    userLogo.innerHTML = initials;
}

function guestLogo(userLogo) {
    userLogo.innerHTML = 'G'
}

function checkSessionStorage() {
    return sessionStorage.getItem('session_token') !== null;
}

function clearSessionStorage() {
    sessionStorage.clear();
}

function logout() {
    clearSessionStorage();
}

function redirectToPreviousPage() {
    location.href = document.referrer;
    return false;
}

// template animation and navigation
function hightlightCurrentButton() {
    let links = document.querySelectorAll("a.button-side-bar");

    let currentUrl = window.location.href;
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let currentLink = link.href;
        if (currentLink == currentUrl) {
            link.classList.add("bg-color-button-sidebar");
        }
    }
}

function closeDropdown() {
    let dropdownContent = document.getElementById("dropDownMenu");
    if (window.innerWidth <= 730) {
        if (!isDropdownOpen) {
            dropdownContent.classList.remove("flyOUT");
            dropdownContent.classList.add("flyIN");
            isDropdownOpen = true;
        } else {
            dropdownContent.classList.add("flyOUT");
            setTimeout(() => {
                dropdownContent.classList.remove("flyIN");
            }, 1000);
            isDropdownOpen = false;
        }
    } else {
        if (!isDropdownOpen) {
            dropdownContent.classList.add("show");
            isDropdownOpen = true;
        } else {
            dropdownContent.classList.remove("show");
            isDropdownOpen = false;
        }
    }
}

window.onclick = function (event) {
    let dropdownContent = document.getElementById("dropDownMenu");
    if (!event.target.matches(".dropdown-menu, .dropdown-menu *") && isDropdownOpen) {
        if (dropdownContent.classList.contains("flyIN") || dropdownContent.classList.contains("show")) {
            dropdownContent.classList.remove("flyIN", "show");
            dropdownContent.classList.add("flyOUT");
            isDropdownOpen = false;
        }
    }
};
