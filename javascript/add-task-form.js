let assignableContacts = [];


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
    let assigningSelection = document.getElementById('assignable-contacts-form');
    assigningSelection.innerHTML = '';
    fillAssigningSelection(assigningSelection);
}


function fillAssigningSelection(assigningSelection) {
    for (let i = 0; i < assignableContacts.length; i++) {
        let contact = assignableContacts[i];
        assigningSelection.innerHTML += `
            <option value="${i}">${contact.name}</option>
        `;
    }
}