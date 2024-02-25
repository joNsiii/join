/**
 * Shows the edit contact form.
 * @param {number} j - The editing contact's id.
 */
function showEditContactForm(j) {
    openDialog('dialog-edit-contact');
    renderEditForm(j);
    setClass('section-edit-contact', addClass, 'dialog-contacts-position');
    setElementAttribute('edit-contact-form', 'onsubmit', `updateEditedContactList(${j}); return false`);
    setElementAttribute('contact-form-delete-button', 'onclick', `openDialogDeleteContact(${j})`);
}


/**
 * Renders the edit contact form's input values.
 * @param {number} j - The editing contact's id.
 */
function renderEditForm(j) {
    renderEditFormProfile(j);
    renderEditFormInfo(j, 'name');
    renderEditFormInfo(j, 'mail');
    renderEditFormInfo(j, 'phone');
}


/**
 * Renders the edit contact form's profile.
 * @param {number} j - The editing contact's id.
 */
function renderEditFormProfile(j) {
    let userProfile = getElement('edit-contact-profile');
    let profile = getInitialLetterGroup(userContacts, j);
    userProfile.innerHTML = profile;
}


/**
 * Renders an edit contact form's input value.
 * @param {number} j - The editing contact's id.
 * @param {String} info - The requested element's id.
 */
function renderEditFormInfo(j, info) {
    let input = getElement(`edit-contact-${info}`);
    let userInfo = getJsonObjectDeepValue(userContacts, j, info);
    input.value = userInfo;
}


/**
 * Closes the edit contact form.
 */
function closeEditContact() {
    setClass('section-edit-contact', removeClass, 'dialog-contacts-position');
    setTimeout(() => {
        closeDialog('dialog-edit-contact')
    }, 100);
}


/**
 * Updates the contact list after editing.
 * @param {number} j - The editing contact's id.
 */
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
function closeSavedContact(id) {
    let style = getElement('save-contact-animation');
    let cssCode = animateSavedContact();
    style.innerHTML = cssCode;
    setTimeout(() => {
        closeDialog(`dialog-${id}-contact`);
        resetAddContactInput();
        setClass(`dialog-${id}-contact`, removeClass, 'dialog-contacts-position');
        style.innerHTML = '';
    }, 100);
}


// jsdoc
function animateSavedContact() {
    return `
        .dialog-contacts-position {
            opacity: 0;
            transition: 100ms opacity ease-in-out;
        }
    `;
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
    }, 100);
}


// jsdoc
async function deleteUserContact(j) {
    await removeUserContact(j);
    resetDialogs();
    initContacts();
    showBacklogContact('Contact successfully deleted');
    setTimeout(async () => {
        closeDialog('dialog-contact-viewer');
    }, 1000);
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
function openContactSettings() {
    openDialog('dialog-contact-settings');
    setClass('section-contact-settings', addClass, 'section-contact-settings-position');
}


// jsdoc
function closeContactSettings() {
    setClass('section-contact-settings', removeClass, 'section-contact-settings-position');
    setTimeout(() => {
        closeDialog('dialog-contact-settings');
    }, 100);
}


// jsdoc
function showBacklogContactForm(id, message) {
    setBacklogContactMessage(`backlog-${id}-contact`, message);
    setClass(`backlog-${id}-contact`, toggleClass, 'backlog-contact-form-in');
    setTimeout(() => {
        setClass(`backlog-${id}-contact`, toggleClass, 'backlog-contact-form-in');
        setClass(`backlog-${id}-contact`, toggleClass, 'backlog-contact-form-out');
        setTimeout(() => {
            setClass(`backlog-${id}-contact`, toggleClass, 'backlog-contact-form-out');
        }, 100);
    }, 800);
}