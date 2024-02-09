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
 * 
 * @param {*} contacts - The list of contacts.
 * @returns - The sorted list of contacts.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Collects the required register letters.
 * 
 * @param {*} contacts - The contacts which are to render subsequently.
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
 * 
 * @param {*} variable - The providing json.
 * @param {*} i - The current object's index.
 * @returns - The initial letter.
 */
function getInitialLetter(variable, i) {
    let name = getJsonObjectDeepValue(variable, i, 'name');
    let initial = getJsonObjectValue(name, 0);
    return initial.toLowerCase();
}


/**
 * Provides a Boolean value by making a comparison between an including array and a requested value. 
 * 
 * @param {*} array - The including array.
 * @param {*} value - The requested value.
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


function fillContactList(contactList) {
    for (let i = 0; i < initials.length; i++) {
        renderRegisterLetter(contactList, i);
        fillRegisterSection(contactList, i);
    }
}


/**
 * Renders a register letter.
 * 
 * @param {*} contactList - The contacts which are to render subsequently.
 * @param {*} i - The current contacts' index.
 */
function renderRegisterLetter(contactList, i) {
    let initial = initials[i].toUpperCase();
    contactList.innerHTML += `<div class="contacts-letter">${initial}</div>`;
}


function fillRegisterSection(contactList, i) {
    for (let j = 0; j < contactSample.length; j++) {
        let match = getMatch(i, j);
        if (match) {
            let first = getInitialLetter(contactSample, j).toUpperCase();
            let second = getSecondInitialLetter(contactSample, j).toUpperCase();
            let name = getJsonObjectDeepValue(contactSample, j, 'name');
            let mail = getJsonObjectDeepValue(contactSample, j, 'mail');
            let bgc = getUserBgc();

            contactList.innerHTML += `
                <div class="contacts-contact">
                    <div class="contact-profile bgc-${bgc}">${first}${second}</div>
                    <div class="name-email-group">
                        <div class="contact-name">${name}</div>
                        <div class="contact-email">${mail}</div>
                    </div>
                </div>
            `;
        }
    }
}


function getMatch(i, j) {
    let first = getInitialLetter(contactSample, j);
    let initial = getJsonObjectValue(initials, i);
    return compareValues(first, initial);
}


function compareValues(valueA, valueB) {
    return valueA == valueB;
}


function getSecondInitialLetter(variable, i) {
    let name = getJsonObjectDeepValue(variable, i, 'name');
    let space = name.indexOf(' ');
    let second = name[space + 1];
    return second.toLowerCase();
}


/**
 * Provides a user's background color.
 * 
 * @returns - A class fraction.
 */
function getUserBgc() {
    bgcCounter = (bgcCounter < bgcUser.length) ? bgcCounter : 0;
    let bgc = bgcUser[bgcCounter];
    bgcCounter++;
    return bgc;
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