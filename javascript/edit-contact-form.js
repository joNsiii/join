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
 * Verfies the edited contact's input values.
 * @param {number} j - The editing contact's id.
 * @param {String} mail The edited mail address.
 */
async function verifyEditedContact(j, mail) {
    let user = users.find(u => u.userId == userId);
    let isUserMail = user.email === mail;
    let isOtherUserMail = users.find(u => u.email === mail);
    let isOthersMail = userContacts.find(c => c.mail === mail);
    let isThisMail = userContacts[j].mail === mail;
    if ((isUserMail || isOtherUserMail || isOthersMail) && !isThisMail) {
        showBacklogContactForm('edit', 'Email already existing');
    } else {
        showEditedContactList(j, mail, isUserMail);
    }
}


/**
 * Shows the edited contact list.
 * @param {number} j - The editing contact's id.
 * @param {String} mail - The edited mail address.
 * @param {Boolean} isUserMail - True or false.
 */
async function showEditedContactList(j, mail, isUserMail) {
    await updateUserData(j, isUserMail);
    closeSavedContact('edit');
    await initContactsUser();
    showEditedContact(mail);
}


/**
 * Updates a contact's data.
 * @param {number} j - The updating contact's id.
 * @param {Boolean} isUserMail - True or false.
 */
async function updateUserData(j, isUserMail) {
    await editContactInfo(j, 'name');
    await editContactInfo(j, 'mail');
    await editContactInfo(j, 'phone');
    if (isUserMail) {
        let user = users.find(u => u.userId === userId);
        saveUserInfo(user);
        await setItem('users', users);
    }
    await saveUserContacts();
}


/**
 * Edits the editing contact's information.
 * @param {number} j - The editing contact's id.
 * @param {String} info - The requested element's id.
 */
async function editContactInfo(j, info) {
    let value = getInputValue(`edit-contact-${info}`);
    userContacts[j][info] = value;
}


/**
 * Saves the user contacts.
 */
async function saveUserContacts() {
    let user = users.find(u => u.userId == userId);
    pushUserContacts(user);
    saveUserInfo(user);
    await setItem('users', users);
}


/**
 * Pushes the user's contacts to the global json.
 * @param {json} user - The receiving json.
 */
function pushUserContacts(user) {
    user.contacts = [];
    for (let i = 0; i < userContacts.length; i++) {
        let userContact = userContacts[i];
        if (userContact.mail != user.email) {
            let contact = getUserContactData(userContact);
            user.contacts.push(contact);
        }
    }
}


/**
 * Provides a user contact's saving data.
 * @param {object} userContact - The providing json.
 * @returns - A user contact's saving data.
 */
function getUserContactData(userContact) {
    return {
        'name': userContact['name'],
        'mail': userContact['mail'],
        'phone': userContact['phone'],
        'bgc-name': userContact['bgc-name'],
        'bgc-code': userContact['bgc-code']
    };
}


/**
 * Saves the user's info.
 * @param {json} user - The saving json.
 */
function saveUserInfo(user) {
    let contact = userContacts.find(c => c.mail == user.email);
    user['name'] = getUserName(contact);
    user['email'] = contact['mail'];
    user['phone'] = contact['phone'];
    user['bgc-name'] = contact['bgc-name'];
    user['bgc-code'] = contact['bgc-code'];
}


/**
 * Provides the user's name without ' (You)'.
 * @param {json} contact - The providing json.
 * @returns - The user's name without ' (You)'.
 */
function getUserName(contact) {
    let name = contact['name'];
    if (name.includes(' (You)')) {
        let nameSplit = name.split(' (You)');
        name = nameSplit[0];
    }
    return name;
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
    initContactsUser();
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


function renderPhoneNumber() {
    let phoneNumber = '+';
    phone = '494444333221';
    for (let i = 0; i < phone.length; i++) {
        if (i == 2 || i == 6 || i == 9 || i == 11) {
            phoneNumber = phoneNumber + ' ' + phone[i];
        } else {
            phoneNumber += phone[i]
        }
    }
    console.log(phoneNumber);
}