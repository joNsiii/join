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

window.onclick = function (event) {
    let dropdownContent = document.getElementById("dropDownMenu");

    if (window.innerWidth <= 730) {
        dropdownContent.classList.remove('flyOUT');
        dropdownContent.classList.add('flyIN');
    } else {
        dropdownContent.classList.add('show');
    }

    if (!event.target.matches('.dropdown-menu, .dropdown-menu *')) {
        if (dropdownContent.classList.contains('flyIN')) {
            dropdownContent.classList.add('flyOUT');

        } if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
};

function closeDropdown() {
    let dropdownContent = document.getElementById("dropDownMenu");
    if (dropdownContent.classList.contains('flyIn')) {
        dropdownContent.classList.add('flyOUT');
        dropdownContent.classList.remove('show');
    }
}



