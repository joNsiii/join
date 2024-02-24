//Variables
let userContacts = [];
let initials;
let bgcNames = ['orange', 'purple', 'blue', 'magenta', 'yellow', 'green', 'dark-blue', 'red', 'cyan'];
let bgcCodes = ['#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#FF4646', '#00BEE8'];
let currentContact;


// Functions
// jsdoc
async function initContacts() {
    await init();
    removeIncludingAttribute();
    await loadUserContacts();
    sortContactsByName(userContacts);
    collectInitials(userContacts);
    setContactBgc(userContacts);
    renderContacts();
    saveUserContacts();
}


// jsdoc
function removeIncludingAttribute() {
    removeElementAttribute('dialog-contact-viewer', 'w3-include-html');
    removeElementAttribute('dialog-add-contact', 'w3-include-html');
    removeElementAttribute('dialog-edit-contact', 'w3-include-html');
}

// jsdoc
async function loadUserContacts() {
    if (userIsLoggedIn()) {
        userId = currentUserData.userId;
        userContacts = await getUserContactList();
    }
}

// jsdoc
async function getUserContactList() {
    let userContactList = [];
    pushUserContact(userContactList);
    pushUserSubcontacts(userContactList);
    return userContactList;
}


// jsdoc
function pushUserContact(userContactList) {
    let userContact = {
        'name': currentUserData.name + ' (You)',
        'mail': currentUserData.email,
        'phone': currentUserData.phone
    };
    userContactList.push(userContact);
}


// jsdoc
function pushUserSubcontacts(userContactList) {
    let subcontacts = currentUserData.contacts;
    for (let i = 0; i < subcontacts.length; i++) {
        let subcontact = subcontacts[i];
        let userSubcontact = {
            'name': subcontact.name,
            'mail': subcontact.mail,
            'phone': subcontact.phone
        }
        userContactList.push(userSubcontact);
    }
}


// jsdoc
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


// jsdoc
function collectInitials(contacts) {
    initials = [];
    for (let i = 0; i < contacts.length; i++) {
        let initial = getInitialLetter(contacts, i);
        setUserContactsObjectValue(i, 'register', initial);
        let match = getIncludingMatch(initials, initial);
        (!match) ? initials.push(initial) : false;
    }
}


// jsdoc
function getInitialLetter(contacts, i) {
    let name = getJsonObjectDeepValue(contacts, i, 'name');
    let initial = getJsonObjectValue(name, 0);
    return initial.toLowerCase();
}


// jsdoc
function setUserContactsObjectValue(i, key, value) {
    userContacts[i][key] = value;
}


// jsdoc
function getIncludingMatch(array, value) {
    return array.includes(value);
}


// jsdoc
function setContactBgc(contacts) {
    let counter = 0;
    for (let i = 0; i < contacts.length; i++) {
        setContactBgcName(counter, i);
        setContactBgcCode(counter, i);
        counter = (counter < bgcNames.length) ? ++counter : 0;
    }
}


// jsdoc
function setContactBgcName(counter, i) {
    let name = bgcNames[counter];
    setUserContactsObjectValue(i, 'bgc-name', name);
}


// jsdoc
function setContactBgcCode(counter, i) {
    let code = bgcCodes[counter];
    setUserContactsObjectValue(i, 'bgc-code', code);
}


// jsdoc
function renderContacts() {
    let contactList = getElement('contacts-collector');
    contactList.innerHTML = '';
    fillContactList(contactList);
}


// jsdoc
function fillContactList(contactList) {
    for (let i = 0; i < initials.length; i++) {
        renderRegisterLetter(contactList, i);
        fillRegisterSection(contactList, i);
    }
}


// jsdoc
function renderRegisterLetter(contactList, i) {
    let initial = getJsonObjectValue(initials, i).toUpperCase();
    contactList.innerHTML += `<div class="contacts-letter">${initial}</div>`;
}


// jsdoc
function fillRegisterSection(contactList, i) {
    for (let j = 0; j < userContacts.length; j++) {
        let match = getInitialsMatch(i, j);
        if (match) {
            renderContact(contactList, j);
        }
    }
}


// jsdoc
function getInitialsMatch(i, j) {
    let first = getInitialLetter(userContacts, j);
    let initial = getJsonObjectValue(initials, i);
    return compareValues(first, initial);
}


// jsdoc
function compareValues(valueA, valueB) {
    return valueA == valueB;
}


// jsdoc
function renderContact(contactList, j) {
    contactList.innerHTML += `
        <div id="contacts-contact-${j}" class="contacts-contact" onclick="showContact(${j})">
            ${renderContactProfile(j)}
            ${renderNameMailGroup(j)}
        </div>
    `;
}


// jsdoc
function renderContactProfile(j) {
    let bgc = getJsonObjectDeepValue(userContacts, j, 'bgc-name');
    let initialLetters = getInitialLetterGroup(userContacts, j);
    return `<div id="contact-profile-${j}" class="contact-profile bgc-${bgc}">
                <div class="contact-profile-text">${initialLetters}</div>
            </div>`;
}


// jsdoc
function getInitialLetterGroup(variable, i) {
    let first = getInitialLetter(variable, i).toUpperCase();
    let last = getLastInitialLetter(variable, i).toUpperCase();
    return first + last;
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
function renderNameMailGroup(j) {
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    let mail = getJsonObjectDeepValue(userContacts, j, 'mail');
    return `
        <div class="name-email-group">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${mail}</div>
        </div>
    `;
}


// jsdoc
async function saveUserContacts() {
    let user = users.find(u => u.userId == userId);
    pushUserContacts(user);
    setUserBgc(user);
    await setItem('users', users);
}


// jsdoc
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


// jsdoc
function getUserContactData(userContact) {
    return {
        'name': userContact['name'],
        'mail': userContact['mail'],
        'phone': userContact['phone'],
        'bgc-name': userContact['bgc-name'],
        'bgc-code': userContact['bgc-code']
    };
}


// jsdoc
function setUserBgc(user) {
    let contact = userContacts.find(c => c.mail == user.email);
    user['bgc-name'] = contact['bgc-name'];
    user['bgc-code'] = contact['bgc-code'];
}