let isDropdownOpen = false;
let contacts = [];
let currentUserData;
let userId = sessionStorage.getItem('session_token');
boardTasks = [];

async function init() {
    await loadUsers();
    await loadUserData();
    await includeHTML();
    checkForLogin();
    loadUserImage();
    hightlightCurrentButton();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

function checkForLogin() {
    if (userIsLoggedIn() == '' && guestIsLoggedIn() == '') {
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
    return getCookie('user_session_token');
}

function guestIsLoggedIn() {
    return getCookie('guest_session_token')
}

async function loadUserData() {
    let userId = getCookie('user_session_token');
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

function deleteCookie(cookieName) {
    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function logout() {
    deleteCookie('user_session_token');
    deleteCookie('guest_session_token');
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
