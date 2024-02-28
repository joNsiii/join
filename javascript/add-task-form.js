let assignableContacts = [];


function openAddTaskForm() {
    document.getElementById('dialog-add-task').show();
    initAddTaskForm();
}


function closeAddTaskForm() {
    document.getElementById('dialog-add-task').close();
}


async function initAddTaskForm() {
    await loadAssignableContacts();
    renderAssignableContacts();
}


async function loadAssignableContacts() {
    let user = currentUserData;
    pushAssignableUser(user);
    pushAssignableUserContacts(user);
}


function pushAssignableUser(user) {
    assignableContacts.push(user);
}


function pushAssignableUserContacts(user) {
    let contacts = user.contacts;
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        assignableContacts.push(contact);
    }
}


function renderAssignableContacts() {
    let assigningSelection = document.getElementById('assignable-contacts-collector');
    assigningSelection.innerHTML = '';
    fillAssigningSelection(assigningSelection);
}


function fillAssigningSelection(assigningSelection) {
    for (let i = 0; i < assignableContacts.length; i++) {
        let contact = assignableContacts[i];
        let initialLetters = getInitialLetterGroup(contact);
        assigningSelection.innerHTML += `
            <div id="assignable-contact-${i}" class="assignable-contact-group" onclick="selectAssignableContact(${i}, true)">
                <div class="assignable-contact">
                    <div class="assignable-contact-initials bgc-${contact['bgc-name']}">${initialLetters}</div>
                    <div class="assignable-contact-name">${contact.name}</div>
                </div>
                <img id="assignable-contact-checkbox-${i}" src="./img/check-button-false.png" alt="check-button-false">
            </div>
        `;
    }
}


function getInitialLetterGroup(contact) {
    let nameGroup = contact.name.split(' ');
    let name = nameGroup[0][0] + nameGroup[nameGroup.length - 1][0];
    return name;
}


function selectAssignableContact(i, selecting) {
    let image = document.getElementById(`assignable-contact-checkbox-${i}`);
    let contact = document.getElementById(`assignable-contact-${i}`);
    if (selecting) {
        image.src = './img/check-button-true.png';
        contact.setAttribute('onclick', `selectAssignableContact(${i}, false)`);
    } else {
        image.src = './img/check-button-false.png';
        contact.setAttribute('onclick', `selectAssignableContact(${i}, true)`);
    }
}