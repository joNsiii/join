// Bitte loeschen!!!
load('contactSample');


function updateEditForm(j) {
    openDialog('dialog-edit-contact');
    renderEditForm(j);
    setElementAttribute('edit-contact-form', 'onsubmit', `updateEditedContact(${j}); return false`);
    setElementAttribute('save-edited-contact-button', 'onclick', `updateEditedContact(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `deleteContact(${j})`);

    setElementAttribute('contact-settings-dialog', 'onclick', `openContactSettingsDialog(${j})`);
}


function renderEditForm(j) {
    renderEditFormProfile(j);
    renderEditFormInfo(j, 'name');
    renderEditFormInfo(j, 'mail');
    renderEditFormInfo(j, 'phone');
}


function renderEditFormProfile(j) {
    let userProfile = getElement('edit-contact-profile');
    let profile = getInitialLetterGroup(contactSample, j);
    userProfile.innerHTML = profile;
}


function renderEditFormInfo(j, info) {
    let input = getElement(`edit-contact-${info}`);
    let userInfo = getJsonObjectDeepValue(contactSample, j, info);
    input.value = userInfo;
}


function updateEditedContact(j) {
    saveEditContact(j);
    closeDialog('dialog-edit-contact');
    initContacts();
    updateContactViewer(j);
}


function saveEditContact(j) {
    saveEditedContactInfo(j, 'name');
    saveEditedContactInfo(j, 'mail');
    saveEditedContactInfo(j, 'phone');
}


function saveEditedContactInfo(j, info) {
    let input = getInputValue(`edit-contact-${info}`);
    contactSample[j][info] = input;
    save('contactSample', contactSample);
}


function getInputValue(id) {
    return document.getElementById(id).value;
}


function deleteContact(j) {
    contactSample.splice(j, 1);
    setClassOnCommand('contact-user', 'remove', 'cu-enabled');
    closeDialog('dialog-contact-viewer');
    sortContactsByName(contactSample);
    collectInitials(contactSample);
    renderContacts();
    save('contactSample', contactSample);
    // updateContactViewer(j);
}


function openContactSettingsMobile(j) {
    openDialog('contact-settings-dialog');
    setElementAttribute('contact-settings-edit-button', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('contact-settings-delete-button', 'onclick', `deleteContact(${j})`);
}


function closeContactViewerMobile() {
    setClassOnCommand('contact-user', 'remove', 'cu-enabled');
    closeDialog('dialog-contact-viewer');
}


async function updateContactList() {
    addContact();
    resetAddContactInput();
    return initContacts();
}


function addContact() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    let phone = getInputValue('add-contact-phone');
    let user = addUserContact(name, mail, phone);
    addToCurrentUser(user);
    contactSample.push(user);
}


function addUserContact(name, mail, phone) {
    return {
        'name': name,
        'mail': mail,
        'phone': phone
    };
}

async function addToCurrentUser(user) {
    let userId = localStorage.getItem('session_token');
    let userData = users.find(u => u.id == userId);

    if (userData) {
        userData['contacts'].push(user);
    }
    await setItem('users', userData);
}

function resetAddContactInput() {
    let ids = ['name', 'mail', 'phone'];
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let info = getElement(`add-contact-${id}`);
        info.value = '';
    }
}


// Bitte loeschen!!!
function save(key, variable) {
    let variableAsText = JSON.stringify(variable);
    localStorage.setItem(key, variableAsText)
}


// Bitte loeschen!!!
function load(key) {
    let variableAsText = localStorage.getItem(key);
    if (variableAsText && key == 'contactSample') {
        contactSample = JSON.parse(variableAsText);
    }
}