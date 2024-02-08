let contactSample = [
    {
        'name': 'Anton Mayer',
        'mail': 'anton@gmail.com',
        'bgc': 'orange'
    },
    {
        'name': 'Anja Schulz',
        'mail': 'schulz@hotmail.com',
        'bgc': 'purple'
    },
    {
        'name': 'Benedikt Ziegler',
        'mail': 'benedikt@gmail.com',
        'bgc': 'blue'
    },
    {
        'name': 'David Eisenberg',
        'mail': 'davidberg@gmail.com',
        'bgc': 'magenta'
    },
    {
        'name': 'Eva Fischer',
        'mail': 'eva@gmail.com',
        'bgc': 'yellow'
    },
    {
        'name': 'Emmanuel Mauer',
        'mail': 'emmanuelma@gmail.com',
        'bgc': 'green'
    },
    {
        'name': 'Marcel Bauer',
        'mail': 'bauer@gmail.com',
        'bgc': 'dark-blue'
    },
    {
        'name': 'Tatjana Wolf',
        'mail': 'wolf@gmail.com',
        'bgc': 'red'
    }
];

let initials = [];
let backgroundColor = ['orange', 'purple', 'blue', 'magenta', 'yellow', 'green', 'dark-blue', 'red'];
let bgcCounter = 0;


function collectInitials() {
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