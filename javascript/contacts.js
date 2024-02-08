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
        'name': 'Walter Walhalter',
        'mail': 'walhalter@gmail.com'
    }
];

let initials;
let backgroundColor = ['orange', 'purple', 'blue', 'magenta', 'yellow', 'green', 'dark-blue', 'red'];
let bgcCounter = 0;


function collectInitials() {
    initials = [];
    for (let i = 0; i < contactSample.length; i++) {
        let name = contactSample[i]['name'];
        let initial = name[0];
        contactSample[i]['register'] = initial;
        let match = initials.includes(initial);
        (!match) ? initials.push(initial) : false;
    }
}


function renderContacts() {
    let contactList = getElement('contacts-collector');
    contactList.innerHTML = '';
    fillContactList(contactList);
}


function getElement(id) {
    return document.getElementById(id);
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


function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

// contactSample = sortContactsByName(contactSample);

// lowerCase beruecksichtigen!!!