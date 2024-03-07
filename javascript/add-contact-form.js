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
 * Renders the phone number's start.
 * @param {String} id - The input element's id.
 */
function renderPhoneStart(id) {
    let phone = getElement(id);
    if (phone.value == '') {
        phone.value = '+49 ';
    }
}


/**
 * Verifies the key type.
 * @param {event} event - The event.
 * @param {String} id - The input element's id.
 */
function verifyKeyType(event, id) {
    let length = getInputValue(`${id}`).length;
    let isNumberKey = /[0-9]/.test(event.key);
    let isControlKey = event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Enter';
    let isBackspace = event.key == 'Backspace';
    if (isNumberKey || isControlKey && length != 1) {
        setElementAttribute(`${id}`, 'onkeypress', `formatPhoneNumber('${id}', ${isBackspace})`);
        setElementAttribute(`${id}`, 'onkeyup', `formatPhoneNumber('${id}', ${isBackspace})`);
    } else {
        event.preventDefault();
        removeElementAttribute(`${id}`, 'onkeypress');
        removeElementAttribute(`${id}`, 'onkeyup');
    }
}


/**
 * Formats the phone number.
 * @param {String} id - The input element's id.
 * @param {Boolean} isBackspace - True or false.
 */
function formatPhoneNumber(id, isBackspace) {
    let phone = getElement(id);
    let length = phone.value.length;
    let isSpace = length == 3 || length == 8 || length == 12 || length == 15 || length == 17;
    if (!isBackspace && isSpace) {
        phone.value += ' ';
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
 * Verifies the added contact's input values.
 * @param {String} mail - The entered mail address.
 */
async function verifyContactInput(mail) {
    let user = users.find(u => u.userId == userId);
    let isUserMail = user.email === mail;
    let isOtherUserMail = users.find(u => u.email === mail);
    let isOthersMail = userContacts.find(c => c.mail === mail);
    if (isUserMail || isOtherUserMail || isOthersMail) {
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
    await initContactsUser();
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