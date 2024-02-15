// Bitte loeschen!!!
load('contactSample');


function updateEditForm(j) {
    openDialog('dialog-edit-contact');
    renderEditForm(j);
    setElementAttribute('edit-contact-form', 'onsubmit', `updateEditedContact(${j}); return false`);
    setElementAttribute('save-edited-contact-button', 'onclick', `updateEditedContact(${j})`);
    setElementAttribute('contact-form-delete-button', 'onclick', `deleteContact(${j})`);

    // setElementAttribute('dialog-contact-settings', 'onclick', `openContactSettingsDialog(${j})`);
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
    let name = getInputValue('edit-contact-name');
    let mail = getInputValue('edit-contact-mail');
    if (name == '' || mail == '') {
        console.log('no function');
    } else {
        saveEditContact(j);
        closeDialog('dialog-edit-contact');
        initContacts();
        updateContactViewer(j);
        console.log('saved');
    }
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
    showUserInfo(false);
    // setClassOnCommand('contact-user', 'remove', 'contact-user-enabled');
    closeDialog('dialog-edit-contact');
    closeDialog('dialog-contact-viewer');
    sortContactsByName(contactSample);
    collectInitials(contactSample);
    renderContacts();
    save('contactSample', contactSample);
    // updateContactViewer(j);

    console.log('deleted');
}


function openContactSettingsMobile(j) {
    openDialog('dialog-contact-settings');
    setElementAttribute('edit-contact-button-mobile', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `deleteContact(${j})`);
}


function closeContactViewerMobile() {
    setClassOnCommand(currentContact, 'remove', 'contacts-contact-active');
    showUserInfo(false);
    // setClassOnCommand('contact-user', 'remove', 'contact-user-enabled');
    closeDialog('dialog-contact-viewer');
}


async function updateContactList() {
    addContact();
    closeDialog('dialog-add-contact');
    resetAddContactInput();
    return initContacts();
}


function addContact() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    let phone = getInputValue('add-contact-phone');
    let user = addUserContact(name, mail, phone);
    addToCurrentUser(user, mail);
    contactSample.push(user);
}


function addUserContact(name, mail, phone) {
    return {
        'name': name,
        'mail': mail,
        'phone': phone
    };
}


async function addToCurrentUser(user, mail) {
    let userData = users.find(u => u.userId == userId);
    let checkedUser = users.find(u => u.contacts.find(c => c.mail === mail));
    if (checkedUser) {
        return console.log('already in')   /* PopUp statt console.log()  */
    } else {
        userData['contacts'].push(user);
    }
    await setItem('users', users);
}


function closeAddContact() {
    closeDialog('dialog-add-contact');
    resetAddContactInput();
}


function resetAddContactInput() {
    let ids = ['name', 'mail', 'phone'];
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let info = getElement(`add-contact-${id}`);
        info.value = '';
    }
}


function getLastInitialLetter(variable, i) {
    let name = getJsonObjectDeepValue(variable, i, 'name');
    let space = name.indexOf(' ');
    let last = '';
    while (space > -1) {
        last = name[space];
        space = name.indexOf(' ');
        name = (space < 0) ? name : name.replace(' ', '');
    }
    return last.toLowerCase();
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