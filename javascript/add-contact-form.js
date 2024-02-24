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
    }, 100);
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
    }, 100);
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