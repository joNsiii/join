// jsdoc
function showEditContactForm(j) {
    openDialog('dialog-edit-contact');
    renderEditForm(j);
    setClassOnCommand('section-edit-contact', 'add', 'dialog-contacts-position');
    setElementAttribute('edit-contact-form', 'onsubmit', `updateEditedContactList(${j}); return false`);
    setElementAttribute('contact-form-delete-button', 'onclick', `openDialogDeleteContact(${j})`);
}


// jsdoc
function renderEditForm(j) {
    renderEditFormProfile(j);
    renderEditFormInfo(j, 'name');
    renderEditFormInfo(j, 'mail');
    renderEditFormInfo(j, 'phone');
}


// jsdoc
function renderEditFormProfile(j) {
    let userProfile = getElement('edit-contact-profile');
    let profile = getInitialLetterGroup(userContacts, j);
    userProfile.innerHTML = profile;
}


// jsdoc
function renderEditFormInfo(j, info) {
    let input = getElement(`edit-contact-${info}`);
    let userInfo = getJsonObjectDeepValue(userContacts, j, info);
    input.value = userInfo;
}


// jsdoc
async function deleteUserContact(j) {
    await removeUserContact(j);
    resetDialogs();
    initContacts();
    showBacklogContact('Contact successfully deleted');
    setTimeout(async () => {
        closeDialog('dialog-contact-viewer');
    }, 1050);
}


// jsdoc
async function removeUserContact(j) {
    let user = users.find(u => u.userId == userId);
    let contact = user.contacts.find(c => c.mail == userContacts[j].mail);
    let contactId = user.contacts.indexOf(contact);
    user.contacts.splice(contactId, 1);
    currentContact = undefined;
    await setItem('users', users);
}


// jsdoc
function resetDialogs() {
    closeDialog('dialog-delete-contact');
    closeDialog('dialog-edit-contact');
    closeDialog('dialog-contact-settings');
    showUserInfo(false);
}


// jsdoc
async function updateContactList() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    if (name != '' && mail != '') {
        verifyContactInput(mail);
    }
}


// jsdoc
async function verifyContactInput(mail) {
    let user = users.find(u => u.userId == userId);
    let checkedUser = users.find(u => u.contacts.find(c => c.mail === mail));
    if (checkedUser) {
        showBacklogContactForm('add', 'Email already existing');
    } else {
        await pushNewUserContact(user);
        showUpdatedContactList(mail);
    }
}


// jsdoc
async function pushNewUserContact(user) {
    let contact = getNewContact();
    user.contacts.push(contact);
    await setItem('users', users);
}


// jsdoc
function getNewContact() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    let phone = getInputValue('add-contact-phone');
    let contact = createNewContact(name, mail, phone);
    return contact;
}


// jsdoc
function createNewContact(name, mail, phone) {
    return {
        'name': name,
        'mail': mail,
        'phone': phone
    };
}


// jsdoc
async function showUpdatedContactList(mail) {
    closeSavedContact('add');
    await initContacts();
    showAddedContact(mail);
    setTimeout(() => {
        showBacklogContact('Contact successfully created');
    }, 125);
}


// jsdoc
function showAddedContact(mail) {
    let contactId = getContactId(mail);
    showContact(contactId);
    location.href = `#contacts-contact-${contactId}`;
}


// jsdoc
function getContactId(mail) {
    let contact = userContacts.find(c => c.mail == mail);
    return userContacts.indexOf(contact);
}


// jsdoc
async function updateEditedContactList(j) {
    let name = getInputValue('edit-contact-name');
    let mail = getInputValue('edit-contact-mail');
    if (name != '' && mail != '') {
        verifyEditedContact(j, mail);
    }
}


// jsdoc
async function verifyEditedContact(j, mail) {
    let thisMail = mail !== userContacts[j].mail;
    let othersMail = users.find(u => u.contacts.find(c => c.mail === mail))
    if (thisMail && othersMail) {
        showBacklogContactForm('edit', 'Email already existing');
    } else {
        showEditedContactList(j, mail);
    }
}


// jsdoc
async function showEditedContactList(j, mail) {
    await updateUserData(j);
    closeSavedContact('edit');
    await initContacts();
    showEditedContact(mail);
}


// jsdoc
async function updateUserData(j) {
    editContactInfo(j, 'name');
    editContactInfo(j, 'mail');
    editContactInfo(j, 'phone');
    await saveUserContacts();
}


// jsdoc
function editContactInfo(j, info) {
    let value = getInputValue(`edit-contact-${info}`);
    userContacts[j][info] = value;
}


// jsdoc
function showEditedContact(mail) {
    let contactId = getContactId(mail);
    highlightCurrentContact(contactId);
    renderContactViewer(contactId);
    linkUserInfo(contactId);
    setContactButtonOnclick(contactId);
    setTimeout(() => {
        showBacklogContact('Contact successfully saved');
    }, 125);
}


// jsdoc
function closeEditContact() {
    setClassOnCommand('section-edit-contact', 'remove', 'dialog-contacts-position');
    setTimeout(() => {
        closeDialog('dialog-edit-contact')
    }, 125);
}


// jsdoc
function openAddContact() {
    openDialog('dialog-add-contact');
    setClassOnCommand('section-add-contact', 'add', 'dialog-contacts-position');
}


// jsdoc
function closeAddContact() {
    setClassOnCommand('section-add-contact', 'remove', 'dialog-contacts-position');
    setTimeout(() => {
        closeDialog('dialog-add-contact');
        resetAddContactInput();
    }, 125);
}


// jsdoc
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


// jsdoc
function animateSavedContact() {
    return `
        .dialog-contacts-position {
            opacity: 0;
            transition: 125ms opacity ease-in-out;
        }
    `;
}


// jsdoc
function openContactSettings() {
    openDialog('dialog-contact-settings');
    setClassOnCommand('section-contact-settings', 'add', 'section-contact-settings-position');
}


// jsdoc
function closeContactSettings() {
    setClassOnCommand('section-contact-settings', 'remove', 'section-contact-settings-position');
    setTimeout(() => {
        closeDialog('dialog-contact-settings');
    }, 125);
}


// jsdoc
function resetAddContactInput() {
    let ids = ['name', 'mail', 'phone'];
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let info = getElement(`add-contact-${id}`);
        info.value = '';
    }
}


// jsdoc
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


// jsdoc
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


// jsdoc
function setBacklogContactMessage(id, message) {
    let backlog = getElement(id);
    backlog.innerHTML = message;
}


// jsdoc
function setBacklogContactPosition(position, valueIn, valueOut) {
    let style = getElement('backlog-contact-animation');
    let cssCode = animateBacklogContact(position, valueIn);
    style.innerHTML = cssCode;
    setTimeout(() => {
        cssCode = animateBacklogContact(position, valueOut);
        style.innerHTML = cssCode;
    }, 800);
}


// jsdoc
function animateBacklogContact(position, value) {
    return `
        .backlog-contact-animation {
            ${position}: ${value};
        }
    `;
}


// jsdoc
function showBacklogContactForm(id, message) {
    setBacklogContactMessage(`backlog-${id}-contact`, message);
    setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-contact-form-in');
    setTimeout(() => {
        setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-contact-form-in');
        setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-contact-form-out');
        setTimeout(() => {
            setClassOnCommand(`backlog-${id}-contact`, 'toggle', 'backlog-contact-form-out');
        }, 125);
    }, 800);
}


// jsdoc
function openDialogDeleteContact(j) {
    openDialog('dialog-delete-contact');
    renderDeletingConfirmation(j);
}


function renderDeletingConfirmation(j) {
    let messageBox = getElement('deleting-confirmation-message');
    let buttonBar = getElement('contact-form-button-bar');
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    let isUser = (name.includes(' (You)'));
    if (!isUser) {
        messageBox.innerHTML = `
            ${getDeletingMessageContact(j)}
        `;
        buttonBar.innerHTML = `
            <button class="contact-form-button" onclick="closeDialog('dialog-delete-contact')">
                <div class="contact-form-button-text">Cancel</div>
            </button>
            <button id="dialog-delete-contact-button" class="contact-form-button-dark" onlick="deleteUserContact(${j})">
                <div id="delete-contact-button-name" class="contact-form-button-dark-text">Delete</div>
            </button>
        `;
    } else {
        messageBox.innerHTML = `
            ${getDeletingMessageUser()}
        `;
        buttonBar.innerHTML = `
            <button class="contact-form-button" onclick="closeDialog('dialog-delete-contact')">
                <div class="contact-form-button-text">Cancel</div>
            </button>
            <button id="dialog-delete-contact-button" class="contact-form-button-dark" onclick="generateDeletingUserForm(${j})">
                <div id="delete-contact-button-name" class="contact-form-button-dark-text">Confirm</div>
            </button>
        `;
    }
    setClassOnCommand('delete-contact-form', 'add', 'd-none');
}


// jsdoc
function getDeletingMessageContact(j) {
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    return `
        Are you sure to remove<br>
        <b id="deleting-contact-name" class="deleting-contact-name">${name}</b><br>
        from your contacts?
    `;
}


// jsdoc
function getDeletingMessageUser() {
    return `
        Are you sure to delete<br>
        <b id="deleting-contact-name" class="deleting-contact-name c-lightblue">your account</b><br>
        irreversibly?
    `;
}


function generateDeletingUserForm(j) {
    let messageBox = getElement('deleting-confirmation-message');
    let buttonBar = getElement('contact-form-button-bar');
    messageBox.innerHTML = `
            ${generateDeletingMessageForm()}
    `;
    setClassOnCommand('delete-contact-form', 'remove', 'd-none');
    setElementAttribute('delete-contact-form', 'onsubmit', `generateDeletingConfirmation(${j}); return false`);
    buttonBar.innerHTML = `
        <button class="contact-form-button" onclick="closeDeleteContact()">
            <div class="contact-form-button-text">Cancel</div>
        </button>
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" type="submit" form="delete-contact-form">
            <div id="delete-contact-button-name" class="contact-form-button-dark-text">Delete</div>
        </button>
    `;
}


function generateDeletingMessageForm() {
    return `
        Please enter <b class="c-lightblue">email</b> and <b class="c-lightblue">password</b> to resign your join account.
    `;
}


async function generateDeletingConfirmation(j) {
    let email = getInputValue('deleting-account-mail');
    let password = getInputValue('deleting-account-password');

    // compare input + userData + input border color!!!
    if (email == currentUserData.email && password == currentUserData.password) {
        let dialog = getElement('deleting-confirmation');

        // Please improve text!!!
        dialog.innerHTML = `
        <p class="deleting-confirmation-message">
            Your account with the name<br>
            <b class="c-lightblue">name</b> is deleted.<br>
            You will be logged out.
        </p>
    `;

        setTimeout(() => {
            window.location.href = `./login.html`;
        }, 800);


        // Please set + verify input + timeout + logout!!!

        // logout();
        let userData = users.find(u => u.userId == userId);
        let userIndex = users.indexOf(userData);
        console.log(userIndex);

        users.splice(userIndex, 1);
        await setItem('users', users);
    } else {
        setClassOnCommand('delete-user-mail', 'remove', 'delete-contact-input-wrong');
        setClassOnCommand('deleting-hint-mail', 'add', 'd-none');
        setClassOnCommand('delete-user-password', 'remove', 'delete-contact-input-wrong');
        setClassOnCommand('deleting-hint-password', 'add', 'd-none');
        if (email != currentUserData.email) {
            setClassOnCommand('delete-user-mail', 'add', 'delete-contact-input-wrong');
            setClassOnCommand('deleting-hint-mail', 'remove', 'd-none');
        }
        if (password != currentUserData.password) {
            setClassOnCommand('delete-user-password', 'add', 'delete-contact-input-wrong');
            setClassOnCommand('deleting-hint-password', 'remove', 'd-none');
        }


    }
}


function closeDeleteContact() {
    closeDialog('dialog-delete-contact');
    resetDeleteContactForm();
}


function resetDeleteContactForm() {
    setClassOnCommand('delete-user-mail', 'remove', 'delete-contact-input-wrong');
    setClassOnCommand('deleting-hint-mail', 'add', 'd-none');
    setClassOnCommand('delete-user-password', 'remove', 'delete-contact-input-wrong');
    setClassOnCommand('deleting-hint-password', 'add', 'd-none');

    let mail = getElement('deleting-account-mail');
    mail.value = '';
    let password = getElement('deleting-account-password');
    password.value = '';
}


async function deleteEmptyContacts(i) {
    let currentUser = users.find(u => u.userId == userId);
    currentUser.contacts.splice(i, 1);
    await setItem('users', users);
}