//Variables
let userContacts = [];
let initials;
let currentContact;


// Functions
/**
 * Initializes the contacts.
 */
async function initContacts() {
    await init();
    removeIncludingAttribute();
    (userIsLoggedIn()) ? initContactsUser() : initContactsGuest();
}


/**
 * Removes the attribute 'w3-include-html' from the dialog elements.
 */
function removeIncludingAttribute() {
    removeElementAttribute('dialog-contact-viewer', 'w3-include-html');
    removeElementAttribute('dialog-add-contact', 'w3-include-html');
    removeElementAttribute('dialog-edit-contact', 'w3-include-html');
}


/**
 * Initializes the contacts for guests.
 */
function initContactsGuest() {
    setElementAttribute('add-contact-button', 'disabled', true);
    setElementAttribute('add-contact-button-mobile', 'disabled', true);
    renderContactsGuestHint();
}


/**
 * Renders the contacts' guest hint.
 */
function renderContactsGuestHint() {
    let contactList = getElement('contacts-collector');
    contactList.innerHTML = `
        <p class="contacts-guest-hint">
            Would you like to add a contact?<br>
            Then sign up <a href="./signup.html" target="_blank">here</a>.
        </p>
    `;
}


/**
 * Initializes the user's contacts.
 */
async function initContactsUser() {
    await loadUserContacts();
    sortContactsByName(userContacts);
    collectInitials(userContacts);
    setContactBgc(userContacts);
    renderContacts();
    saveUserContacts();
}


/**
 * Loads the user contacts.
 */
async function loadUserContacts() {
    userId = currentUserData.userId;
    userContacts = await getUserContactList();
}


/**
 * Provides the user's contact list.
 * @returns - The user's contact list.
 */
async function getUserContactList() {
    let userContactList = [];
    pushUserContact(userContactList);
    pushUserSubcontacts(userContactList);
    return userContactList;
}


/**
 * Pushes the user's data to the user's contact list.
 * @param {json} userContactList - The receiving json.
 */
function pushUserContact(userContactList) {
    let userContact = {
        'name': currentUserData.name + ' (You)',
        'mail': currentUserData.email,
        'phone': currentUserData.phone
    };
    userContactList.push(userContact);
}


/**
 * Pushes the user's contact data to the user's contact list.
 * @param {json} userContactList - The receiving json.
 */
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


/**
 * Sorts a contact list by name.
 * @param {json} contacts - The sorting json.
 * @returns - The sorted contact list.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Collects the initials of the register.
 * @param {json} contacts - The providing json.
 */
function collectInitials(contacts) {
    initials = [];
    for (let i = 0; i < contacts.length; i++) {
        let initial = getInitialLetter(contacts, i);
        setUserContactsObjectValue(i, 'register', initial);
        let match = getIncludingMatch(initials, initial);
        (!match) ? initials.push(initial) : false;
    }
}


/**
 * Provides the initial letter of a contact's name.
 * @param {json} contacts - The providing json.
 * @param {number} i - The providing contact's id.
 * @returns - The initial letter of a contact's name.
 */
function getInitialLetter(contacts, i) {
    let name = getJsonObjectDeepValue(contacts, i, 'name');
    let initial = getJsonObjectValue(name, 0);
    return initial.toLowerCase();
}


/**
 * Sets an object value of the json userConctacts.
 * @param {number} i - The setting contact's id.
 * @param {value} key - The setting object's key.
 * @param {value} value - The setting value.
 */
function setUserContactsObjectValue(i, key, value) {
    userContacts[i][key] = value;
}


/**
 * Provides a Boolean value by comparing two values.
 * @param {array} array - The comparing array.
 * @param {value} value - The comparing value.
 * @returns - True or false.
 */
function getIncludingMatch(array, value) {
    return array.includes(value);
}


/**
 * Sets a contact's background color.
 * @param {json} contacts - The settting json.
 */
function setContactBgc(contacts) {
    let counter = 0;
    for (let i = 0; i < contacts.length; i++) {
        if (userContacts[i].mail != currentUserData.email) {
            setContactBgcName(counter, i);
            setContactBgcCode(counter, i);
            counter = (counter < bgcNames.length - 1) ? ++counter : 0;
        } else {
            userContacts[i]['bgc-name'] = 'lightblue';
            userContacts[i]['bgc-code'] = '#29ABE2';
        }
    }
}


/**
 * Sets a contact's background color's name.
 * @param {number} counter - The background color's counter.
 * @param {number} i - The background color's name's index.
 */
function setContactBgcName(counter, i) {
    let name = bgcNames[counter];
    setUserContactsObjectValue(i, 'bgc-name', name);
}


/**
 * Sets a contact's background color's code.
 * @param {number} counter - The background color's counter.
 * @param {number} i - The background color's code's index.
 */
function setContactBgcCode(counter, i) {
    let code = bgcCodes[counter];
    setUserContactsObjectValue(i, 'bgc-code', code);
}


/**
 * Renders the user contacts.
 */
function renderContacts() {
    let contactList = getElement('contacts-collector');
    contactList.innerHTML = '';
    fillContactList(contactList);
}


/**
 * Fills the contact list.
 */
function fillContactList(contactList) {
    for (let i = 0; i < initials.length; i++) {
        renderRegisterLetter(contactList, i);
        fillRegisterSection(contactList, i);
    }
}


/**
 * Renders a register letter.
 * @param {json} contactList - The providing json.
 * @param {number} i - The register letter's index.
 */
function renderRegisterLetter(contactList, i) {
    let initial = getJsonObjectValue(initials, i).toUpperCase();
    contactList.innerHTML += `<div class="contacts-letter">${initial}</div>`;
}


/**
 * Fills a register section.
 * @param {json} contactList - The providing json.
 * @param {number} i - The register letter's index.
 */
function fillRegisterSection(contactList, i) {
    for (let j = 0; j < userContacts.length; j++) {
        let match = getInitialsMatch(i, j);
        if (match) {
            renderContact(contactList, j);
        }
    }
}


/**
 * Provides a Boolean value by comparing initial letters.
 * @param {number} i - The register letter's index.
 * @param {number} j - The contact's id.
 * @returns - True or false.
 */
function getInitialsMatch(i, j) {
    let first = getInitialLetter(userContacts, j);
    let initial = getJsonObjectValue(initials, i);
    return compareValues(first, initial);
}


/**
 * Compares two values.
 * @param {value} valueA - The comparing value A.
 * @param {value} valueB - The comparing value B.
 * @returns - True or false.
 */
function compareValues(valueA, valueB) {
    return valueA == valueB;
}


/**
 * Renders a contact.
 * @param {json} contactList - The providing json.
 * @param {number} j - The rendering contact's id.
 */
function renderContact(contactList, j) {
    contactList.innerHTML += `
        <div id="contacts-contact-${j}" class="contacts-contact" onclick="showContact(${j})">
            ${renderContactProfile(j)}
            ${renderNameMailGroup(j)}
        </div>
    `;
}


/**
 * Renders a contact's profile.
 * @param {number} j - The rendering contact's id.
 * @returns - The html code of a contact's profile.
 */
function renderContactProfile(j) {
    let bgc = getJsonObjectDeepValue(userContacts, j, 'bgc-name');
    let initialLetters = getInitialLetterGroup(userContacts, j);
    return `<div id="contact-profile-${j}" class="contact-profile bgc-${bgc}">
                <div class="contact-profile-text">${initialLetters}</div>
            </div>`;
}


/**
 * Provides a contact's initial letters.
 * @param {variable} variable - The providing variable.
 * @param {number} i - The providing cntact's id.
 * @returns - A contact's initial letters.
 */
function getInitialLetterGroup(variable, i) {
    let first = getInitialLetter(variable, i).toUpperCase();
    let last = getLastInitialLetter(variable, i).toUpperCase();
    return first + last;
}


/**
 * Provides a contact's last initial letter.
 * @param {variable} variable - The providing variable.
 * @param {number} i - The providing contact's id.
 * @returns - A contact's last initial letter.
 */
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


/**
 * Renders a contact's name and mail address.
 * @param {number} j - The rendering contact's id.
 * @returns - The html code of a contact's name and mail address.
 */
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