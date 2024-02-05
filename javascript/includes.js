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

function toggleDropdown() {
    var dropdownContent = document.getElementById("dropDownMenu");
    dropdownContent.classList.toggle("show");
}

window.onclick = function(event) {
    var dropdownContent = document.getElementById("dropDownMenu");

    if (!event.target.matches('.dropdown-menu, .dropdown-menu *')) {
        if (dropdownContent.classList.contains("show")) {
            dropdownContent.classList.remove("show");
        }
    }
};


