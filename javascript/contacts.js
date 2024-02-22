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


function pushUserContact(userContactList) {
    let userContact = {
        'contact-id': -1,    // notwendig?
        'name': currentUserData.name + ' (You)',
        'mail': currentUserData.email,
        'phone': currentUserData.phone
    };    // Objekt auslagern?
    userContactList.push(userContact);
}


function pushUserSubcontacts(userContactList) {
    let subcontacts = currentUserData.contacts;
    for (let i = 0; i < subcontacts.length; i++) {
        let subcontact = subcontacts[i];
        let userSubcontact = {
            'contact-id': i,    // notwenidg?
            'name': subcontact.name,
            'mail': subcontact.mail,
            'phone': subcontact.phone
        }    // Object auslagern?
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
function setUserContactsObjectValue(i, key, value) {
    userContacts[i][key] = value;
}


// jsdoc
function getInitialLetter(contacts, i) {
    let name = getJsonObjectDeepValue(contacts, i, 'name');
    let initial = getJsonObjectValue(name, 0);
    return initial.toLowerCase();
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
function showContact(j) {
    let classes = getElementAttribute(`contacts-contact-${j}`, 'class');
    let match = getIncludingMatch(classes, 'contacts-contact-active');
    if (!match) {
        highlightCurrentContact(j);
        updateContactViewer(j);
    } else {
        closeContactViewerMobile();
    }
}


// jsdoc
function highlightCurrentContact(j) {
    if (currentContact !== undefined) {
        setClassOnCommand(currentContact, 'remove', 'contacts-contact-active');
    }
    currentContact = `contacts-contact-${j}`;
    setClassOnCommand(currentContact, 'add', 'contacts-contact-active');
}


// jsdoc
function updateContactViewer(j) {
    openDialog('dialog-contact-viewer');
    renderContactViewer(j);
    linkUserInfo(j);
    setContactButtonOnclick(j);
    showUserInfo(true);
}


// jsdoc
function renderContactViewer(j) {
    renderUserBgc(j);
    renderContactViewerVersion(j);
    renderContactViewerVersion(j, 'mobile');
}


// jsdoc
function renderUserBgc(j) {
    let bgc = getJsonObjectDeepValue(userContacts, j, 'bgc-code');
    let bgcCss = getElement('user-bgc-flexible');
    bgcCss.innerHTML = `
        .bgc-flexible {
            background-color: ${bgc};
        }
    `;
}


// jsdoc
function renderContactViewerVersion(j, extension) {
    (!extension) ? renderUserProfile(j) : renderUserProfile(j, extension);
    (!extension) ? renderUserInfo(j, 'name') : renderUserInfo(j, 'name', extension);
    (!extension) ? renderUserInfo(j, 'mail') : renderUserInfo(j, 'mail', extension);
    (!extension) ? renderUserInfo(j, 'phone') : renderUserInfo(j, 'phone', extension);
}


// jsdoc
function renderUserProfile(j, extension) {
    let id = 'contact-user-profile';
    id = (!extension) ? id : id + `-${extension}`;
    let userProfile = getElement(id);
    let profile = getInitialLetterGroup(userContacts, j);
    userProfile.innerHTML = profile;
}


// jsdoc
function renderUserInfo(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getElement(id);
    let value = getJsonObjectDeepValue(userContacts, j, info);
    userInfo.innerHTML = value;
}


// jsdoc
function linkUserInfo(j) {
    setUserInfoLinkVersion(j);
    setUserInfoLinkVersion(j, 'mobile');
}


// jsdoc
function setUserInfoLinkVersion(j, extension) {
    (!extension) ? setUserInfoLink(j, 'mail') : setUserInfoLink(j, 'mail', 'mobile');
    (!extension) ? setUserInfoLink(j, 'phone') : setUserInfoLink(j, 'phone', 'mobile');
}


// jsdoc
function setUserInfoLink(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getJsonObjectDeepValue(userContacts, j, info);
    (info == 'mail') ? setElementAttribute(id, 'href', `mailto: ${userInfo}`) : setElementAttribute(id, 'href', `tel: ${userInfo}`);
}


// jsdoc
function setContactButtonOnclick(j) {
    setElementAttribute('edit-contact-button', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('edit-contact-button-mobile', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('delete-contact-button', 'onclick', `openDialogDeleteContact(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `openDialogDeleteContact(${j})`);
}


// jsdoc
function showUserInfo(logical) {
    let value = (logical) ? '55px' : '100%';
    let style = getElement('contact-user-animation');
    style.innerHTML = (logical) ? animateContactUserIn(value) : animateContactUserOut(value);
}


// jsdoc
function animateContactUserIn(value) {
    return `
        .contact-user-animation {
            left: ${value};
            transition: 125ms left ease-in-out;
        }
    `;
}


// jsdoc
function animateContactUserOut(value) {
    return `
        .contact-user-animation {
            left: ${value};
        }
    `;
}