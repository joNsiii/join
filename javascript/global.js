let isDropdownOpen = false;
let contacts = [];
let currentUserData;
let userId = sessionStorage.getItem('session_token');


async function init() {
    await loadUsers();
    await includeHTML();
    hightlightCurrentButton();
    loadUserData()
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function isLoggedIn() {
    const sessionToken = sessionStorage.getItem('session_token');
    return sessionToken !== null;
}

function loadUserData() {
    let userId = sessionStorage.getItem('session_token');
    console.log(userId);
    let userData = users.find(u => u.userId == userId);

    if (userData) {
        currentUserData = userData;
        console.log('Current user data:', currentUserData);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    if (isLoggedIn()) {
        console.log('User is logged in');
    } else {
        console.log('User is not logged in');
    }
});

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
