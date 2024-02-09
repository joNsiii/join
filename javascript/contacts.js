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
let backgroundColor = ['orange', 'purple', 'blue', 'magenta', 'yellow', 'green', 'dark-blue', 'red'];
let bgcCounter = 0;


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
 * @param {*} contacts - The contact list which is to render subsequently.
 */
function collectInitials(contacts) {
    initials = [];
    for (let i = 0; i < contacts.length; i++) {
        let name = getJsonObjectDeepValue(contactSample, i, 'name');
        let initial = getJsonObjectValue(name, 0);
        contacts[i]['register'] = initial;
        let match = getIncludingMatch(initials, initial);
        (!match) ? initials.push(initial) : false;
    }
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
        let initial = initials[i];
        contactList.innerHTML += `<div class="contacts-letter">${initial}</div>`

        for (let j = 0; j < contactSample.length; j++) {
            let name = contactSample[j]['name'];
            let first = name[0];
            let match = first == initial;
            if (match) {
                let space = name.indexOf(' ');
                let second = name[space + 1];
                let mail = contactSample[j]['mail'];
                bgcCounter = (bgcCounter < backgroundColor.length) ? bgcCounter : 0;
                let bgc = backgroundColor[bgcCounter];
                bgcCounter++;

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