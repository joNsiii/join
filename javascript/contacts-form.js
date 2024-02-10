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
    save('contactSample', contactSample);
    closeDialog('dialog-contact-viewer');
    initContacts();
    updateContactViewer(j);
}


function openContactSettingsMobile(j) {
    openDialog('contact-settings-dialog');
    setElementAttribute('contact-settings-edit-button', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('contact-settings-delete-button', 'onclick', `deleteContact(${j})`);
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