async function init() {
    await includeHTML();
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

function hightlightCurrentButton() {
    let links = document.querySelectorAll("a.button-side-bar");

    let currentUrl = window.location.href;
    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let currentLink = link.href;
        if (currentLink == currentUrl) {
            link.classList.add("bg-color-button-sidebar");
        } else {
            console.log("no URL found");
        }
    }
}


window.onclick = function(event) {
    let dropdownContent = document.getElementById("dropDownMenu");

    if (!event.target.matches('.dropdown-menu, .dropdown-menu *')) {
        if (dropdownContent.classList.contains("show")) {
            dropdownContent.classList.remove("show");
        }
    }
};


function openMenu(dropdownContent) {
    dropdownContent.classList.add("show");
    requestAnimationFrame(() => {
        dropdownContent.style.transform = "translateX(0)";
    });
}

function closeMenu(dropdownContent) {
    dropdownContent.style.transform = "translateX(100%)";
    dropdownContent.addEventListener('transitionend', function handler() {
        dropdownContent.classList.remove("show");
        dropdownContent.removeEventListener('transitionend', handler);
    });
}

function toggleDropdown() {
    let dropdownContent = document.getElementById("dropDownMenu");

    if (window.innerWidth <= 730) {
        if (dropdownContent.classList.contains("show")) {
            closeMenu(dropdownContent);
        } else {
            openMenu(dropdownContent);
        }
    } else {
        dropdownContent.classList.toggle("show");
    }
}

function adjustDropdownOnResize() {
    let dropdownContent = document.getElementById("dropDownMenu");

    if (window.innerWidth > 730) {
        dropdownContent.style.removeProperty('transform');
    }
}

window.addEventListener('resize', adjustDropdownOnResize);

