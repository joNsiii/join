// Bitte loeschen!!!
load('contactSample');


function updateEditForm(j) {
    openDialog('dialog-edit-contact');
    renderEditForm(j);
    setClassOnCommand('section-edit-contact', 'add', 'dialog-contacts-position');
    setElementAttribute('edit-contact-form', 'onsubmit', `updateEditedContactList(${j}); return false`);
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
    closeDialog('dialog-contact-settings');
    await initContacts();
    setTimeout(() => {
        showBacklogContact('Contact successfully deleted');
    }, 125);
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
    let mail = getInputValue('add-contact-mail');
    if (name != '' && mail != '') {
        verifyContactInput(mail);
    }
}


async function verifyContactInput(mail) {
    let userData = users.find(u => u.userId == userId);
    let checkedUser = users.find(u => u.contacts.find(c => c.mail === mail));
    if (checkedUser) {
        showBacklogContactForm('add', 'Email already existing');
    } else {
        let user = getNewContact();
        userData['contacts'].push(user);
        await setItem('users', users);
        showUpdatedContactList(mail);
    }
}


function getNewContact() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    let phone = getInputValue('add-contact-phone');
    let contact = createNewContact(name, mail, phone);
    return contact;
}


function createNewContact(name, mail, phone) {
    return {
        'contact-id': contactSample.length - 1,
        'name': name,
        'mail': mail,
        'phone': phone
    };
}


async function showUpdatedContactList(mail) {
    closeSavedContact('add');
    await initContacts();
    let createdIndex = contactSample.find(c => c.mail == mail);
    let renderingIndex = contactSample.indexOf(createdIndex);
    showContact(renderingIndex);
    location.href = `#contacts-contact-${renderingIndex}`;
    setTimeout(() => {
        showBacklogContact('Contact successfully created');
    }, 125);
}


async function updateEditedContactList(j) {
    let name = getInputValue('edit-contact-name');
    let mail = getInputValue('edit-contact-mail');
    if (name != '' && mail != '') {
        verifyEditedContact(j, mail);
    }
}


async function verifyEditedContact(j, mail) {
    let userData = users.find(u => u.userId == userId);
    let checkedUser = users.find(u => u.contacts.find(c => c.mail === mail)) && mail !== contactSample[j].mail;
    if (checkedUser) {
        showBacklogContactForm('edit', 'Email already existing');
    } else {
        await updateUserData(j, userData);
        closeSavedContact('edit');
        await initContacts();
        showEditedContact(mail);
    }
}


async function updateUserData(j, userData) {
    let contactId = contactSample[j]['contact-id'];
    let name = getInputValue('edit-contact-name');
    let mail = getInputValue('edit-contact-mail');
    let phone = getInputValue('edit-contact-phone');
    userData['contacts'][contactId]['name'] = name;
    userData['contacts'][contactId]['mail'] = mail;
    userData['contacts'][contactId]['phone'] = phone;
    await setItem('users', users);
}


function showEditedContact(mail) {
    let currentUser = contactSample.find(c => c['mail'] == mail);
    let userIndex = contactSample.indexOf(currentUser);
    highlightCurrentContact(userIndex);
    renderContactViewer(userIndex);
    setUserInfo(userIndex);
    setElementAttribute('edit-contact-button', 'onclick', `updateEditForm(${userIndex})`);
    setElementAttribute('edit-contact-button-mobile', 'onclick', `updateEditForm(${userIndex})`);
    setElementAttribute('delete-contact-button', 'onclick', `deleteUserContact(${userIndex})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `deleteUserContact(${userIndex})`);
    setTimeout(() => {
        showBacklogContact('Contact successfully saved');
    }, 125);
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


function showBacklogContact(message) {
    let bodyWidth = document.body.offsetWidth;
    if (bodyWidth > 1400) {
        setBacklogContactMessage('backlog-contact', message);
        setBacklogContactPosition('left', '55px', '100%');
    } else {
        setBacklogContactMessage('backlog-contact-mobile', message);
        setBacklogContactPosition('bottom', '110px', '-74px');
    }
}


function setBacklogContactMessage(id, message) {
    let backlog = getElement(id);
    backlog.innerHTML = message;
}


function setBacklogContactPosition(position, valueIn, valueOut) {
    let style = getElement('backlog-contact-animation');
    let cssCode = animateBacklogContact(position, valueIn);
    style.innerHTML = cssCode;
    setTimeout(() => {
        cssCode = animateBacklogContact(position, valueOut);
        style.innerHTML = cssCode;
    }, 800);
}


function animateBacklogContact(position, value) {
    return `
        .backlog-contact-animation {
            ${position}: ${value};
        }
    `;
}


function showBacklogContactForm(id, message) {
    setBacklogContactMessage(`backlog-${id}-contact`, message);
    setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-add-contact-in');
    setTimeout(() => {
        setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-add-contact-in');
        setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-add-contact-out');
        setTimeout(() => {
            setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-add-contact-out');
        }, 125);
    }, 800);
}


async function deleteEmptyContacts(i) {
    let currentUser = users.find(u => u.userId == userId);
    currentUser.contacts.splice(i, 1);
    await setItem('users', users);
}