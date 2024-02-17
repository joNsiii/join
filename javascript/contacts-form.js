// Bitte loeschen!!!
load('contactSample');


function updateEditForm(j) {
    openDialog('dialog-edit-contact');
    renderEditForm(j);
    setClassOnCommand('section-edit-contact', 'add', 'dialog-contacts-position');
    setElementAttribute('edit-contact-form', 'onsubmit', `updateEditedContactList(${j}); return false`);
    setElementAttribute('save-edited-contact-button', 'onclick', `updateEditedContactList(${j})`);
    setElementAttribute('contact-form-delete-button', 'onclick', `deleteUserContact(${j})`);

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
        updateEditedContactList(j);
        // saveEditContact(j);
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


async function deleteUserContact(j) {
    let currentUser = users.find(u => u.userId == userId);
    let contactId = contactSample[j]['contact-id'];
    currentUser.contacts.splice(contactId, 1);
    currentContact = undefined;
    await setItem('users', users);
    showUserInfo(false);
    closeDialog('dialog-edit-contact');
    closeDialog('dialog-contact-viewer');
    initContacts();
}


function openContactSettingsMobile(j) {
    openDialog('dialog-contact-settings');
    setElementAttribute('edit-contact-button-mobile', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `deleteUserContact(${j})`);
}


function closeContactViewerMobile() {
    setClassOnCommand(currentContact, 'remove', 'contacts-contact-active');
    showUserInfo(false);
    // setClassOnCommand('contact-user', 'remove', 'contact-user-enabled');
    closeDialog('dialog-contact-viewer');
}


async function updateContactList() {
    let name = getInputValue('add-contact-name');
    await addContact();
    closeSavedContact('add');
    await initContacts();
    let createdIndex = contactSample.find(c => c.name == name);
    let renderIndex = contactSample.indexOf(createdIndex);
    showContact(renderIndex);
    location.href = `#contacts-contact-${renderIndex}`;
    setTimeout(showBacklogContact, 125);
}


async function addContact() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    let phone = getInputValue('add-contact-phone');
    let user = addUserContact(name, mail, phone);
    await addToCurrentUser(user, mail);
    contactSample.push(user);
}


function addUserContact(name, mail, phone) {
    return {
        'contact-id': contactSample.length - 1,
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


// For editUserContact()
async function updateEditedContactList(j) {
    let mail = getInputValue('edit-contact-mail');
    await editContact(j);
    closeSavedContact('edit');
    await initContacts();

    let currentUser = contactSample.find(c => c['mail'] == mail);
    let userIndex = contactSample.indexOf(currentUser);
    highlightCurrentContact(userIndex);

    renderContactViewer(userIndex);    // Mobile Version fixen!!!
    setUserInfo(userIndex);
    setElementAttribute('edit-contact-button', 'onclick', `updateEditForm(${userIndex})`);
    setElementAttribute('edit-contact-button-mobile', 'onclick', `updateEditForm(${userIndex})`);
    setElementAttribute('delete-contact-button', 'onclick', `deleteUserContact(${userIndex})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `deleteUserContact(${userIndex})`);
}


async function editContact(j) {
    let currentMail = contactSample[j]['mail'];
    let contactId = contactSample[j]['contact-id'];
    let name = getInputValue('edit-contact-name');
    let mail = getInputValue('edit-contact-mail');
    let phone = getInputValue('edit-contact-phone');

    // Bedingung hier einfuegen!!!
    let alreadyExisting = contactSample.find(c => c['mail'] == mail);
    if (alreadyExisting && mail === alreadyExisting['mail'] && mail != currentMail) {
        console.log('already existing');
        console.log(alreadyExisting['name']);
    } else {
        let userData = users.find(u => u.userId == userId);
        let userContact = userData.contacts.find(c => c['contact-id'] == contactId);
        if (userContact) {
            userContact['name'] = name;
            userContact['mail'] = mail;
            userContact['phone'] = phone;
        }

        setItem('users', users);
    }
}


function closeEditContact() {
    setClassOnCommand('section-edit-contact', 'remove', 'dialog-contacts-position');
    setTimeout(() => {
        closeDialog('dialog-edit-contact')
    }, 125);
}


function openAddContact() {
    openDialog('dialog-add-contact');
    setClassOnCommand('section-add-contact', 'add', 'dialog-contacts-position');
}


function closeAddContact() {
    setClassOnCommand('section-add-contact', 'remove', 'dialog-contacts-position');
    setTimeout(() => {
        closeDialog('dialog-add-contact');
        resetAddContactInput();
    }, 125);
}


function closeSavedContact(id) {
    let style = getElement('save-contact-animation');
    let cssCode = animateSavedContact();
    style.innerHTML = cssCode;
    setTimeout(() => {
        closeDialog(`dialog-${id}-contact`);
        resetAddContactInput();
        setClassOnCommand(`dialog-${id}-contact`, 'remove', 'dialog-contacts-position');
        style.innerHTML = '';
    }, 125);
}


function animateSavedContact() {
    return `
        .dialog-contacts-position {
            opacity: 0;
            transition: 125ms opacity ease-in-out;
        }
    `;
}


function openContactSettings() {
    openDialog('dialog-contact-settings');
    setClassOnCommand('section-contact-settings', 'add', 'section-contact-settings-position');
}


function closeContactSettings() {
    setClassOnCommand('section-contact-settings', 'remove', 'section-contact-settings-position');
    setTimeout(() => {
        closeDialog('dialog-contact-settings');
    }, 125);
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
    name = (name.includes(' (You)')) ? name.replace(' (You)', '') : name;
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


function showBacklogContact() {
    let style = getElement('backlog-contact-animation');
    let cssCode = animateBacklogContact('55px');
    style.innerHTML = cssCode;

    setTimeout(() => {
        cssCode = animateBacklogContact('100%');
        style.innerHTML = cssCode;
    }, 800);
}


function animateBacklogContact(value) {
    return `
        .backlog-contact-animation {
            left: ${value};
        }
    `;
}