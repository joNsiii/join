//Variables
let contactSample = [
    {
        'name': 'Rudolf Reiner',
        'mail': 'rudolf@gmail.com',
        'phone': '+49 3333 333 33 3'
    },
    {
        'name': 'Susi Landstreich',
        'mail': 'streich@hotmail.com',
        'phone': '+49 4444 444 44 4'
    },
    {
        'name': 'Karl Kaiser',
        'mail': 'karl@gmail.com',
        'phone': '+49 1111 111 11 1'
    },
    {
        'name': 'Richard Raiser',
        'mail': 'raiser@gmail.com',
        'phone': '+49 2222 222 22 2'
    },
    {
        'name': 'Walter Walhalter',
        'mail': 'walhalter@gmail.com',
        'phone': '+49 5555 555 55 5'
    },
    {
        'name': 'Cyrus Cyberwelt',
        'mail': 'cyberwelt@gmail.com',
        'phone': '+49 7777 777 77 7'
    },
    {
        'name': 'Lisa Liger',
        'mail': 'lisa@gmail.com',
        'phone': '+49 6666 666 66 6'
    }
];

let initials;
let bgcNames = ['orange', 'purple', 'blue', 'magenta', 'yellow', 'green', 'dark-blue', 'red', 'cyan'];
let bgcCodes = ['#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#FF4646', '#00BEE8'];
let bgcCounter = 0;
let currentContact;


// Functions
/**
 * Initializes the user's contacts.
 */
async function initContacts() {
    await init();
    // contactSample = [
    //     {
    //         'name': currentUserData.name,
    //         'mail': currentUserData.email,
    //         'phone': currentUserData.phone
    //     },
    //     {
    //         'name': currentUserData.contacts[0].name,
    //         'mail': currentUserData.contacts[0].mail,
    //         'phone': currentUserData.contacts[0].phone
    //     },
    //     {
    //         'name': currentUserData.contacts[1].name,
    //         'mail': currentUserData.contacts[1].mail,
    //         'phone': currentUserData.contacts[1].phone
    //     }
    // ];
    contactSample = await getUserContactList();
    sortContactsByName(contactSample);
    collectInitials(contactSample);
    renderContacts();

    // Bitte loeschen!!!
    save('contactSample', contactSample);
}


async function getUserContactList() {
    let userContactList = [];
    getUserContact(userContactList);
    // let userContact = getUserContact(userContactList);
    // userContactList.push(userContact);
    getUserSubcontacts(userContactList);
    // let userSubcontacts = getUserSubcontacts(userContactList);
    // userContactList.push(userSubcontacts);
    return userContactList;
}


function getUserContact(userContactList) {
    let userContact = {
        'name': currentUserData.name + ' (You)',
        'mail': currentUserData.email,
        'phone': currentUserData.phone
    };
    userContactList.push(userContact);
    // return userContact;
}


function getUserSubcontacts(userContactList) {
    // let userSubcontacts = [];
    for (let i = 0; i < currentUserData.contacts.length; i++) {
        let userSubcontact = {
            'name': currentUserData.contacts[i].name,
            'mail': currentUserData.contacts[i].mail,
            'phone': currentUserData.contacts[i].phone
        }
        userContactList.push(userSubcontact);
        // userSubcontacts.push(userSubcontact);
    }
    // return userSubcontacts;
}


/**
 * Sorts a list of contacts alphabetically.
 * @param {json} contacts - The list of contacts.
 * @returns - The sorted list of contacts.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Collects the required register letters.
 * @param {json} contacts - The contacts which are to render subsequently.
 */
function collectInitials(contacts) {
    initials = [];
    for (let i = 0; i < contacts.length; i++) {
        let initial = getInitialLetter(contactSample, i);
        contacts[i]['register'] = initial;
        let match = getIncludingMatch(initials, initial);
        (!match) ? initials.push(initial) : false;
    }
}


/**
 * Provides the initial letter of a name.
 * @param {json} variable - The providing json.
 * @param {index} i - The current object's index.
 * @returns - The initial letter in lower case.
 */
function getInitialLetter(variable, i) {
    let name = getJsonObjectDeepValue(variable, i, 'name');
    let initial = getJsonObjectValue(name, 0);
    return initial.toLowerCase();
}


/**
 * Provides a Boolean value by making a comparison between an including array and a requested value. 
 * @param {array} array - The including array.
 * @param {value} value - The requested value.
 * @returns - True or false.
 */
function getIncludingMatch(array, value) {
    return array.includes(value);
}


/**
 * Renders the user's contacts.
 */
function renderContacts() {
    let contactList = getElement('contacts-collector');
    contactList.innerHTML = '';
    fillContactList(contactList);
}


/**
 * Fills the element 'contacts-collector'..
 * @param {element} contactList - The element which collects the user contacts.
 */
function fillContactList(contactList) {
    bgcCounter = 0;
    for (let i = 0; i < initials.length; i++) {
        renderRegisterLetter(contactList, i);
        fillRegisterSection(contactList, i);
    }
}


/**
 * Renders the register letter i.
 * @param {element} contactList - The element which collects the register lettters.
 * @param {index} i - The current register letter's index.
 */
function renderRegisterLetter(contactList, i) {
    let initial = initials[i].toUpperCase();
    contactList.innerHTML += `<div class="contacts-letter">${initial}</div>`;
}


/**
 * Fills the current register section with user contacts.
 * @param {element} contactList - The element which collects the user contacts.
 * @param {index} i - The current contact's index.
 */
function fillRegisterSection(contactList, i) {
    for (let j = 0; j < contactSample.length; j++) {
        let match = getInitialsMatch(i, j);
        if (match) {
            renderContact(contactList, j);
        }
    }
}


/**
 * Provides the result of an initial match.
 * @param {index} i - The contacts' current index.
 * @param {index} j - The initials' current index.
 * @returns - compareValues(first, initials)
 */
function getInitialsMatch(i, j) {
    let first = getInitialLetter(contactSample, j);
    let initial = getJsonObjectValue(initials, i);
    return compareValues(first, initial);
}


/**
 * Provides a Boolean value.
 * @param {value} valueA - The comparing value A
 * @param {value} valueB - The comparing value B
 * @returns - True or false.
 */
function compareValues(valueA, valueB) {
    return valueA == valueB;
}


/**
 * Renders the contact j.
 * @param {element} contactList - The element which collects the user contacts.
 * @param {index} j - The currents contact's index. 
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
 * Renders the contact profile j.
 * @param {index} j - The current contact profile's index 
 * @returns - The html code of contact profile j.
 */
function renderContactProfile(j) {
    let bgc = getUserBgc(bgcNames, false);
    let bgcHex = getUserBgc(bgcCodes, true);
    let first = getInitialLetter(contactSample, j).toUpperCase();
    let second = getLastInitialLetter(contactSample, j).toUpperCase();
    return `<div id="contact-profile-${j}" class="contact-profile bgc-${bgc}" bgc="${bgcHex}">
                <div class="contact-profile-text">${first}${second}</div>
            </div>`;
}


/**
 * Provides a user's background color.
 * @returns - A class fraction.
 */
function getUserBgc(array, logical) {
    bgcCounter = (bgcCounter < array.length) ? bgcCounter : 0;
    let bgc = array[bgcCounter];
    (logical) ? bgcCounter++ : false;
    return bgc;
}


/**
 * Provides the second initial of contact i.
 * @param {json} variable - The providing json.
 * @param {index} i - The requested object's index.
 * @returns - The second initial letter in lower case.
 */
// function getSecondInitialLetter(variable, i) {
//     let name = getJsonObjectDeepValue(variable, i, 'name');
//     let space = name.indexOf(' ');
//     let second = name[space + 1];
//     return second.toLowerCase();
// }


/**
 * Renders the name-mail-group j.
 * @param {index} j  - The current contact's index.
 * @returns - The html code of name-mail-group j.
 */
function renderNameMailGroup(j) {
    let name = getJsonObjectDeepValue(contactSample, j, 'name');
    let mail = getJsonObjectDeepValue(contactSample, j, 'mail');
    return `
        <div class="name-email-group">
            <div class="contact-name">${name}</div>
            <div class="contact-email">${mail}</div>
        </div>
    `;
}


function showContact(j) {
    highlightCurrentContact(j);
    updateContactViewer(j);
}


function highlightCurrentContact(j) {
    if (currentContact !== undefined) {
        setClassOnCommand(currentContact, 'remove', 'contacts-contact-active');
    }
    currentContact = `contacts-contact-${j}`;
    setClassOnCommand(currentContact, 'add', 'contacts-contact-active');
}


function updateContactViewer(j) {
    openDialog('dialog-contact-viewer');
    renderContactViewer(j);
    setUserInfo(j);
    setElementAttribute('edit-contact-button', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('edit-contact-button-mobile', 'onclick', `updateEditForm(${j})`);
    setElementAttribute('delete-contact-button', 'onclick', `deleteContact(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `deleteContact(${j})`);
}


function renderContactViewer(j) {
    renderUserBgc(j);
    renderContactViewerVersion(j);
    renderContactViewerVersion(j, 'mobile');
}


function renderUserBgc(j) {
    let userProfile = getElement(`contact-profile-${j}`);
    let bgc = userProfile.getAttribute('bgc');
    let bgcCss = getElement('user-bgc-flexible');
    bgcCss.innerHTML = `
        .bgc-flexible {
            background-color: ${bgc};
        }
    `;
    showUserInfo(true);
    // addClass('contact-user', 'contact-user-enabled');
}


function renderContactViewerVersion(j, extension) {
    (!extension) ? renderUserProfile(j) : renderUserProfile(j, extension);
    (!extension) ? renderUserInfo(j, 'name') : renderUserInfo(j, 'name', extension);
    (!extension) ? renderUserInfo(j, 'mail') : renderUserInfo(j, 'mail', extension);
    (!extension) ? renderUserInfo(j, 'phone') : renderUserInfo(j, 'phone', extension);
}


function renderUserProfile(j, extension) {
    let id = 'contact-user-profile';
    id = (!extension) ? id : id + `-${extension}`;
    let userProfile = getElement(id);
    let profile = getInitialLetterGroup(contactSample, j);
    userProfile.innerHTML = profile;
}


function getInitialLetterGroup(variable, i) {
    let first = getInitialLetter(variable, i).toUpperCase();
    let last = getLastInitialLetter(variable, i).toUpperCase();
    return first + last;
}


function renderUserInfo(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getElement(id);
    let name = getJsonObjectDeepValue(contactSample, j, info);
    userInfo.innerHTML = name;
}


function setUserInfo(j) {
    setUserInfoLinkVersion(j);
    setUserInfoLinkVersion(j, 'mobile');
}


function setUserInfoLinkVersion(j, extension) {
    (!extension) ? setUserInfoLink(j, 'mail') : setUserInfoLink(j, 'mail', 'mobile');
    (!extension) ? setUserInfoLink(j, 'phone') : setUserInfoLink(j, 'phone', 'mobile');
}


function setUserInfoLink(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getJsonObjectDeepValue(contactSample, j, info);
    (info == 'mail') ? setElementAttribute(id, 'href', `mailto: ${userInfo}`) : setElementAttribute(id, 'href', `tel: ${userInfo}`);
}


function showUserInfo(logical) {
    let value = getElement('contact-viewer').offsetWidth;
    value = (logical) ? 55 : value;
    value = (value < 55) ? 3840 : value;
    let style = getElement('contact-user-animation');
    style.innerHTML = `
        .contact-user-animation {
            left: ${value}px;
        }
    `;
}


function showImg(id, image) {
    document.getElementById(id).src = `./img/${image}.png`;
}


/*
    E3 / US01 - Kontaktliste
        1. Es gibt eine Seite oder einen Bereich fuer Kontakte. - Check
        2. Kontakte werden alphabetisch nach ihrem Namen sortiert und ihre E-Mail-Adresse unterhalb ihres Namens angezeigt. - Check
        3. Die Liste ist in Abschnitte nach Buchstaben unterteilt, sodass
           Kontakte, die mit einem bestimmten Buchstaben beginnen,
           zusammen gruppiert sind. - Check
        4. Ein Klick auf einen Kontakt oeffnet eine Detailansicht mit dem
           Namen, der E-Mail-Adresse und der Telefonnummer des Kontakts.

    3 von 4 Subtask erledigt.
*/