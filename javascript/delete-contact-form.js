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
    let onclick = (isContact) ? `deleteUserContact(${j})` : `renderDeleteAccountConfirmation(${j})`;
    let name = (isContact) ? 'Delete' : 'Confirm';
    let buttonBar = getElement('contact-form-button-bar');
    buttonBar.innerHTML = `
        ${generateContactFormCancelButton(isContact)}
        ${generateContactFormDeleteButton(onclick, name)}
    `;
}


// jsdoc
function generateContactFormCancelButton(isContact) {
    let onclick = (isContact) ? `closeDialog('dialog-delete-contact')` : `closeDeleteContact()`;
    return `
        <button class="contact-form-button" onclick="${onclick}">
            <div class="contact-form-button-text">Cancel</div>
        </button>
    `;
}


// jsdoc
function generateContactFormDeleteButton(onclick, name) {
    return `
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" onclick="${onclick}">
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


// jsdoc
function renderDeleteAccountConfirmation(j) {
    renderDeleteAccountMessage();
    setDeleteAccountForm(j);
    renderDeleteAccountButtonBar(j);
}


// jsdsoc
function renderDeleteAccountMessage() {
    let messageBox = getElement('deleting-confirmation-message');
    messageBox.innerHTML = `
        Please enter <b class="c-lightblue">email</b> and <b class="c-lightblue">password</b> to resign your join account.
    `;
}


// jsdoc
function setDeleteAccountForm(j) {
    setClassOnCommand('delete-contact-form', 'remove', 'd-none');
    setElementAttribute('delete-contact-form', 'onsubmit', `generateDeletingConfirmation(${j}); return false`);
}


// jsdoc
function renderDeleteAccountButtonBar(j) {
    let buttonBar = getElement('contact-form-button-bar');
    buttonBar.innerHTML = `
        ${generateContactFormCancelButton(j, false)}
        ${generateContactFormSubmitButton()}
    `;
}


// jsdoc
function generateContactFormSubmitButton() {
    return `
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" type="submit" form="delete-contact-form">
            <div id="delete-contact-button-name" class="contact-form-button-dark-text">Delete</div>
        </button>
    `;
}


// jsdoc
async function generateDeletingConfirmation(j) {
    let email = getInputValue('deleting-account-mail');
    let password = getInputValue('deleting-account-password');
    if (email == currentUserData.email && password == currentUserData.password) {
        showDeleteAccountConfirmation();
        redirectToLoginPage();
        deleteUserAccount();
    } else {
        showUpWrongUserInput(email, password);
    }
}


// jsdoc
function showDeleteAccountConfirmation() {
    let dialog = getElement('deleting-confirmation');
    dialog.innerHTML = `
        <p class="deleting-confirmation-message">
            Your account with the user name<br>
            <b class="c-lightblue">name</b> was successfully deleted.<br>
            Please await logout.
        </p>
    `;
}


// jsdoc
function redirectToLoginPage() {
    setTimeout(() => {
        window.location.href = `./login.html`;
    }, 800);
}


// jsdoc
async function deleteUserAccount() {
    let user = users.find(u => u.userId == userId);
    let userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
    await setItem('users', users);
}


// jsdoc
function showUpWrongUserInput(email, password) {
    highlightWrongUserInput('mail', false);
    highlightWrongUserInput('password', false);
    if (email != currentUserData.email) {
        highlightWrongUserInput('mail', true);
    }
    if (password != currentUserData.password) {
        highlightWrongUserInput('password', true);
    }
}


// jsdoc
function highlightWrongUserInput(info, logical) {
    let command = (logical) ? 'add' : 'remove';
    setClassOnCommand(`delete-user-${info}`, command, 'delete-contact-input-wrong');
    command = (logical) ? 'remove' : 'add';
    setClassOnCommand(`deleting-hint-${info}`, command, 'd-none');
}


// jsdoc
function closeDeleteContact() {
    closeDialog('dialog-delete-contact');
    resetDeleteContactForm();
}


// jsdoc
function resetDeleteContactForm() {
    resetDeleteContactInputClasses();
    resetDeleteContactInputValues();
    removeElementAttribute('delete-contact-form', 'onsubmit');
    setClassOnCommand('delete-contact-form', 'add', 'd-none');
}


// jsdoc
function resetDeleteContactInputClasses() {
    setClassOnCommand('delete-user-mail', 'remove', 'delete-contact-input-wrong');
    setClassOnCommand('deleting-hint-mail', 'add', 'd-none');
    setClassOnCommand('delete-user-password', 'remove', 'delete-contact-input-wrong');
    setClassOnCommand('deleting-hint-password', 'add', 'd-none');
}


// jsdoc
function resetDeleteContactInputValues() {
    document.getElementById('deleting-account-mail').value = '';
    document.getElementById('deleting-account-password').value = '';
}