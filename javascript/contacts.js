// Variables
// let contactSample = [
//     {
//         'name': 'Anton Mayer',
//         'mail': 'anton@gmail.com'
//     },
//     {
//         'name': 'Anja Schulz',
//         'mail': 'schulz@hotmail.com'
//     },
//     {
//         'name': 'Benedikt Ziegler',
//         'mail': 'benedikt@gmail.com'
//     },
//     {
//         'name': 'David Eisenberg',
//         'mail': 'davidberg@gmail.com'
//     },
//     {
//         'name': 'Eva Fischer',
//         'mail': 'eva@gmail.com'
//     },
//     {
//         'name': 'Emmanuel Mauer',
//         'mail': 'emmanuelma@gmail.com'
//     },
//     {
//         'name': 'Marcel Bauer',
//         'mail': 'bauer@gmail.com'
//     },
//     {
//         'name': 'Tatjana Wolf',
//         'mail': 'wolf@gmail.com'
//     }
// ];

let contactSample = [
    {
        'name': 'Rudolf Reiner',
        'mail': 'rudolf@gmail.com'
    },
    {
        'name': 'Susi Landstreich',
        'mail': 'streich@hotmail.com'
    },
    {
        'name': 'Karl Kaiser',
        'mail': 'karl@gmail.com'
    },
    {
        'name': 'Richard Raiser',
        'mail': 'raiser@gmail.com'
    },
    {
        'name': 'Walter Walhalter',
        'mail': 'walhalter@gmail.com'
    }
];

let initials;
let bgcUser = ['orange', 'purple', 'blue', 'magenta', 'yellow', 'green', 'dark-blue', 'red'];
let bgcCounter = 0;


// Functions
/**
 * Initializes the user's contacts.
 */
function initContacts() {
    sortContactsByName(contactSample);
    collectInitials(contactSample);
    renderContacts();
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
        <div class="contacts-contact">
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
    let bgc = getUserBgc();
    let first = getInitialLetter(contactSample, j).toUpperCase();
    let second = getSecondInitialLetter(contactSample, j).toUpperCase();
    return `<div class="contact-profile bgc-${bgc}">${first}${second}</div>`;
}


/**
 * Provides a user's background color.
 * @returns - A class fraction.
 */
function getUserBgc() {
    bgcCounter = (bgcCounter < bgcUser.length) ? bgcCounter : 0;
    let bgc = bgcUser[bgcCounter];
    bgcCounter++;
    return bgc;
}


/**
 * Provides the second initial of contact i.
 * @param {json} variable - The providing json.
 * @param {index} i - The requested object's index.
 * @returns - The second initial letter in lower case.
 */
function getSecondInitialLetter(variable, i) {
    let name = getJsonObjectDeepValue(variable, i, 'name');
    let space = name.indexOf(' ');
    let second = name[space + 1];
    return second.toLowerCase();
}


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