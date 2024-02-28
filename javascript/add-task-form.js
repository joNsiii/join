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
        filter = filterAssignableContact(contact);
        if (filter) {
            let assigned = (contact.assigned) ? 'assignable-contact-group-selected' : '';
            let check = (contact.assigned) ? 'assignable-contact-checkbox-active' : '';
            let initialLetters = getInitialLetterGroup(contact);
            assigningSelection.innerHTML += `
                <div id="assignable-contact-${i}" class="assignable-contact-group ${assigned}" onclick="selectAssignableContact(${i}, true)">
                    <div class="assignable-contact">
                        <div class="assignable-contact-initials bgc-${contact['bgc-name']}">${initialLetters}</div>
                        <div class="assignable-contact-name">${contact.name}</div>
                    </div>
                    <div id="assignable-contact-checkbox-${i}" class="assignable-contact-checkbox ${check}"></div>
                </div>
            `;
        }
    }
}


function filterAssignableContact(contact) {
    let input = document.getElementById('assigning-input-form').value.toLowerCase();
    let name = '';
    for (let i = 0; i < input.length; i++) {
        name += contact.name[i];
    }
    return input == '' || name.toLowerCase().includes(input);
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
        image.style.backgroundImage = 'url(./img/check-button-true.png)';
        contact.classList.add('assignable-contact-group-selected');
        contact.setAttribute('onclick', `selectAssignableContact(${i}, false)`);
        assignableContacts[i]['assigned'] = true;
    } else {
        image.style.backgroundImage = 'url(./img/check-button-false.png)';
        contact.classList.remove('assignable-contact-group-selected');
        contact.setAttribute('onclick', `selectAssignableContact(${i}, true)`);
        assignableContacts[i]['assigned'] = false;
    }
}


function showAssignableContacts(value) {
    document.getElementById('assignable-contacts-collector').style.display = value;
}