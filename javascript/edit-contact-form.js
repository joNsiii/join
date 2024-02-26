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


/**
 * Verfies the edited contact input values.
 * @param {number} j - The editing contact's id.
 * @param {String} mail The edited mail address.
 */
async function verifyEditedContact(j, mail) {
    let thisMail = mail !== userContacts[j].mail;
    let othersMail = users.find(u => u.contacts.find(c => c.mail === mail))
    if (thisMail && othersMail) {
        showBacklogContactForm('edit', 'Email already existing');
    } else {
        showEditedContactList(j, mail);
    }
}


/**
 * Shows the edited contact list.
 * @param {number} j - The editing contact's id.
 * @param {String} mail - The edited mail address.
 */
async function showEditedContactList(j, mail) {
    await updateUserData(j);
    closeSavedContact('edit');
    await initContacts();
    showEditedContact(mail);
}


/**
 * Updates the edited contact's data.
 * @param {number} j - The editing contact's id.
 */
async function updateUserData(j) {
    editContactInfo(j, 'name');
    editContactInfo(j, 'mail');
    editContactInfo(j, 'phone');
    await saveUserContacts();
}


/**
 * Edits the editing contact's information.
 * @param {number} j - The editing contact's id.
 * @param {String} info - The requested element's id.
 */
function editContactInfo(j, info) {
    let value = getInputValue(`edit-contact-${info}`);
    userContacts[j][info] = value;
}


/**
 * Closes a dialog after saving an edited contact.
 * @param {String} id - The closing dialog's id.
 */
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


/**
 * Animates the closing of a dialog window.
 * @returns - The css code for the element 'dialog-contacts-position'.
 */
function animateSavedContact() {
    return `
        .dialog-contacts-position {
            opacity: 0;
            transition: 100ms opacity ease-in-out;
        }
    `;
}


/**
 * Shows the edited contact in the contact viewer.
 * @param {String} mail - The showing contact's mail address.
 */
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


/**
 * Deletes a user's contact.
 * @param {number} j - The deleting contact's id.
 */
async function deleteUserContact(j) {
    await removeUserContact(j);
    resetDialogs();
    initContacts();
    showBacklogContact('Contact successfully deleted');
    setTimeout(async () => {
        closeDialog('dialog-contact-viewer');
    }, 1000);
}


/**
 * Removes a contact from the user's data.
 */
async function removeUserContact(j) {
    let user = users.find(u => u.userId == userId);
    let contact = user.contacts.find(c => c.mail == userContacts[j].mail);
    let contactId = user.contacts.indexOf(contact);
    user.contacts.splice(contactId, 1);
    currentContact = undefined;
    await setItem('users', users);
}


/**
 * Closes all dialog windows.
 */
function resetDialogs() {
    closeDialog('dialog-delete-contact');
    closeDialog('dialog-edit-contact');
    closeDialog('dialog-contact-settings');
    showUserInfo(false);
}


/**
 * Opens the contact settings' dialog.
 */
function openContactSettings() {
    openDialog('dialog-contact-settings');
    setClass('section-contact-settings', addClass, 'section-contact-settings-position');
}


/**
 * Closes the contact settings' dialog.
 */
function closeContactSettings() {
    setClass('section-contact-settings', removeClass, 'section-contact-settings-position');
    setTimeout(() => {
        closeDialog('dialog-contact-settings');
    }, 100);
}


/**
 * Shows the backlog of the contact forms.
 * @param {String} id - The showing backlog's id.
 * @param {String} message - The showing backlog's message.
 */
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