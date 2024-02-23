// jsdoc
function openDialogDeleteContact(j) {
    openDialog('dialog-delete-contact');
    renderDeletingConfirmation(j);
}


// jsdoc
function renderDeletingConfirmation(j) {
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    let isUser = (name.includes(' (You)'));
    (!isUser) ? renderDeleteContactForm(j) : renderDeleteUserForm(j);
    setClassOnCommand('delete-contact-form', 'add', 'd-none');
}


// jsdoc
function renderDeleteContactForm(j) {
    renderDeleteContactMessage(j, true);
    renderDeleteContactButtonBar(j, true);
}


// jsdoc
function renderDeleteContactMessage(j, isContact) {
    let messageBox = getElement('deleting-confirmation-message');
    messageBox.innerHTML = `
        ${generateDeletingMessage(j, isContact)}
    `;
}


// jsdoc
function generateDeletingMessage(j, isContact) {
    return (isContact) ? generateDeleteContactMessage(j) : generateDeleteUserMessage();
}


// jsdoc
function generateDeleteContactMessage(j) {
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    return `
        Are you sure to remove<br>
        <b id="deleting-contact-name" class="deleting-contact-name">${name}</b><br>
        from your contacts?
    `;
}


// jsdoc
function renderDeleteContactButtonBar(j, isContact) {
    let onclick = (isContact) ? `onlick="deleteUserContact(${j})"` : `onclick="generateDeletingUserForm(${j})"`;
    let name = (isContact) ? 'Delete' : 'Confirm';
    let buttonBar = getElement('contact-form-button-bar');
    buttonBar.innerHTML = `
        ${generateContactFormCancelButton()}
        ${generateContactFormDeleteButton(onclick, name)}
    `;
}


// jsdoc
function generateContactFormCancelButton() {
    return `
        <button class="contact-form-button" onclick="closeDialog('dialog-delete-contact')">
            <div class="contact-form-button-text">Cancel</div>
        </button>
    `;
}


// jsdoc
function generateContactFormDeleteButton(onclick, name) {
    return `
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" ${onclick}>
            <div id="delete-contact-button-name" class="contact-form-button-dark-text">${name}</div>
        </button>
    `;
}


// jsdoc
function renderDeleteUserForm(j) {
    renderDeleteContactMessage(j, false);
    renderDeleteContactButtonBar(j, false);
}


// jsdoc
function generateDeleteUserMessage() {
    return `
        Are you sure to delete<br>
        <b id="deleting-contact-name" class="deleting-contact-name c-lightblue">your account</b><br>
        irreversibly?
    `;
}


function generateDeletingUserForm(j) {
    let messageBox = getElement('deleting-confirmation-message');
    let buttonBar = getElement('contact-form-button-bar');
    messageBox.innerHTML = `
            ${generateDeletingMessageForm()}
    `;
    setClassOnCommand('delete-contact-form', 'remove', 'd-none');
    setElementAttribute('delete-contact-form', 'onsubmit', `generateDeletingConfirmation(${j}); return false`);
    buttonBar.innerHTML = `
        <button class="contact-form-button" onclick="closeDeleteContact()">
            <div class="contact-form-button-text">Cancel</div>
        </button>
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" type="submit" form="delete-contact-form">
            <div id="delete-contact-button-name" class="contact-form-button-dark-text">Delete</div>
        </button>
    `;
}


function generateDeletingMessageForm() {
    return `
        Please enter <b class="c-lightblue">email</b> and <b class="c-lightblue">password</b> to resign your join account.
    `;
}


async function generateDeletingConfirmation(j) {
    let email = getInputValue('deleting-account-mail');
    let password = getInputValue('deleting-account-password');

    // compare input + userData + input border color!!!
    if (email == currentUserData.email && password == currentUserData.password) {
        let dialog = getElement('deleting-confirmation');

        // Please improve text!!!
        dialog.innerHTML = `
        <p class="deleting-confirmation-message">
            Your account with the name<br>
            <b class="c-lightblue">name</b> is deleted.<br>
            You will be logged out.
        </p>
    `;

        setTimeout(() => {
            window.location.href = `./login.html`;
        }, 800);


        // Please set + verify input + timeout + logout!!!

        // logout();
        let userData = users.find(u => u.userId == userId);
        let userIndex = users.indexOf(userData);
        console.log(userIndex);

        users.splice(userIndex, 1);
        await setItem('users', users);
    } else {
        setClassOnCommand('delete-user-mail', 'remove', 'delete-contact-input-wrong');
        setClassOnCommand('deleting-hint-mail', 'add', 'd-none');
        setClassOnCommand('delete-user-password', 'remove', 'delete-contact-input-wrong');
        setClassOnCommand('deleting-hint-password', 'add', 'd-none');
        if (email != currentUserData.email) {
            setClassOnCommand('delete-user-mail', 'add', 'delete-contact-input-wrong');
            setClassOnCommand('deleting-hint-mail', 'remove', 'd-none');
        }
        if (password != currentUserData.password) {
            setClassOnCommand('delete-user-password', 'add', 'delete-contact-input-wrong');
            setClassOnCommand('deleting-hint-password', 'remove', 'd-none');
        }


    }
}


function closeDeleteContact() {
    closeDialog('dialog-delete-contact');
    resetDeleteContactForm();
}


function resetDeleteContactForm() {
    setClassOnCommand('delete-user-mail', 'remove', 'delete-contact-input-wrong');
    setClassOnCommand('deleting-hint-mail', 'add', 'd-none');
    setClassOnCommand('delete-user-password', 'remove', 'delete-contact-input-wrong');
    setClassOnCommand('deleting-hint-password', 'add', 'd-none');

    let mail = getElement('deleting-account-mail');
    mail.value = '';
    let password = getElement('deleting-account-password');
    password.value = '';
}


async function deleteEmptyContacts(i) {
    let currentUser = users.find(u => u.userId == userId);
    currentUser.contacts.splice(i, 1);
    await setItem('users', users);
}