// async function init() {
//     await includeHTML();
//     hightlightCurrentButton();
// }

// async function includeHTML() {
//     let includeElements = document.querySelectorAll("[w3-include-html]");
//     for (let i = 0; i < includeElements.length; i++) {
//         const element = includeElements[i];
//         file = element.getAttribute("w3-include-html"); // "includes/header.html"
//         let resp = await fetch(file);
//         if (resp.ok) {
//             element.innerHTML = await resp.text();
//         } else {
//             element.innerHTML = "Page not found";
//         }
//     }
// }

// function adjustDropdownOnResize() {
//     let dropdownContent = document.getElementById("dropDownMenu");

//     if (window.innerWidth > 730) {
//         dropdownContent.style.removeProperty('transform');
//     }
// }

// window.addEventListener('resize', adjustDropdownOnResize);