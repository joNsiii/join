/**
 * Opens the add contact form.
 */
function openAddContact() {
    openDialog('dialog-add-contact');
    setClass('section-add-contact', addClass, 'dialog-contacts-position');
}


/**
 * Closes the add contact form.
 */
function closeAddContact() {
    setClass('section-add-contact', removeClass, 'dialog-contacts-position');
    setTimeout(() => {
        closeDialog('dialog-add-contact');
        resetAddContactInput();
    }, 100);
}


/**
 * Resets the add contact form's input elements.
 */
function resetAddContactInput() {
    let ids = ['name', 'mail', 'phone'];
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let info = getElement(`add-contact-${id}`);
        info.value = '';
    }
}


/**
 * Updates the contact list.
 */
async function updateContactList() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    if (name != '' && mail != '') {
        verifyContactInput(mail);
    }
}


/**
 * Verifies the contact form's input values.
 * @param {String} mail - The entered mail address.
 */
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


/**
 * Pushes a new user contact.
 * @param {object} user - The user object which receives the new contact.
 */
async function pushNewUserContact(user) {
    let contact = getNewContact();
    user.contacts.push(contact);
    await setItem('users', users);
}


/**
 * Provides the new contact's data.
 * @returns - The new contact object.
 */
function getNewContact() {
    let name = getInputValue('add-contact-name');
    let mail = getInputValue('add-contact-mail');
    let phone = getInputValue('add-contact-phone');
    let contact = createNewContact(name, mail, phone);
    return contact;
}


/**
 * Creates a new contact object.
 * @param {String} name - The new contact's name.
 * @param {String} mail - The new contact's mail address.
 * @param {String} phone - The new contact's phone number.
 * @returns - A new contact object.
 */
function createNewContact(name, mail, phone) {
    return {
        'name': name,
        'mail': mail,
        'phone': phone
    };
}


/**
 * Shows the updated contact list.
 * @param {String} mail - The entered mail address.
 */
async function showUpdatedContactList(mail) {
    closeSavedContact('add');
    await initContacts();
    showAddedContact(mail);
    setTimeout(() => {
        showBacklogContact('Contact successfully created');
    }, 100);
}


/**
 * Shows the added contact.
 * @param {String} mail - The entered mail address.
 */
function showAddedContact(mail) {
    let contactId = getContactId(mail);
    showContact(contactId);
    location.href = `#contacts-contact-${contactId}`;
}


/**
 * Provides the added contact's rendering index.
 * @param {String} mail - The entered mail address.
 * @returns - The added contact's rendering index.
 */
function getContactId(mail) {
    let contact = userContacts.find(c => c.mail == mail);
    return userContacts.indexOf(contact);
}


/**
 * Shows the contacts' backlog.
 * @param {String} message - The displaying message.
 */
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


/**
 * Sets the message of contacts' backlog.
 * @param {String} id - The requested element's id.
 * @param {String} message - The displaying message.
 */
function setBacklogContactMessage(id, message) {
    let backlog = getElement(id);
    backlog.innerHTML = message;
}


/**
 * Sets the contacts' backlog position.
 * @param {String} position - The appropriate css property's name.
 * @param {value} valueIn - The contacts' backlog coming in value.
 * @param {value} valueOut - The contacts' backlog coming out value.
 */
function setBacklogContactPosition(position, valueIn, valueOut) {
    let style = getElement('backlog-contact-animation');
    let cssCode = animateBacklogContact(position, valueIn);
    style.innerHTML = cssCode;
    setTimeout(() => {
        cssCode = animateBacklogContact(position, valueOut);
        style.innerHTML = cssCode;
    }, 800);
}


/**
 * Animates the contacts' backlog.
 * @param {String} position - The appropriate css property's name.
 * @param {value} value - The contacts' backlog coming value.
 * @returns The css code for the element 'backlog-contact-animation'.
 */
function animateBacklogContact(position, value) {
    return `
        .backlog-contact-animation {
            ${position}: ${value};
        }
    `;
}