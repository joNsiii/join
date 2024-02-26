/**
 * Opens the delete contact form's dialog.
 * @param {number} j - The deleting contact's id.
 */
function openDialogDeleteContact(j) {
    openDialog('dialog-delete-contact');
    renderDeletingConfirmation(j);
}


/**
 * Renders the deleting confirmation.
 * @param {number} j - The deleting contact's id.
 */
function renderDeletingConfirmation(j) {
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    let isUser = (name.includes(' (You)'));
    (!isUser) ? renderDeleteContactForm(j) : renderDeleteUserForm(j);
    setClass('delete-contact-form', addClass, 'd-none');
}


/**
 * Renders the delete contact form.
 * @param {number} j - The deleting contact's id.
 */
function renderDeleteContactForm(j) {
    renderDeleteContactMessage(j, true);
    renderDeleteContactButtonBar(j, true);
}


/**
 * Renders the deleting confirmation's message.
 */
function renderDeleteContactMessage(j, isContact) {
    let messageBox = getElement('deleting-confirmation-message');
    messageBox.innerHTML = `
        ${generateDeletingMessage(j, isContact)}
    `;
}


/**
 * Generates the deleting confirmation's message.
 * @param {number} j - The deleting contact's id.
 * @param {Boolean} isContact - True or false.
 * @returns - The appropriate function to generate the deleting confirmation's message.
 */
function generateDeletingMessage(j, isContact) {
    return (isContact) ? generateDeleteContactMessage(j) : generateDeleteUserMessage();
}


/**
 * Generates the deleting confirmation's message of a contact.
 * @param {number} j - The deleting contact's id.
 * @returns - The inner html code for the element 'deleting-confirmation-message'.
 */
function generateDeleteContactMessage(j) {
    let name = getJsonObjectDeepValue(userContacts, j, 'name');
    return `
        Are you sure to remove<br>
        <b id="deleting-contact-name" class="deleting-contact-name">${name}</b><br>
        from your contacts?
    `;
}


/**
 * Renders the delete contact form's button bar.
 * @param {number} j - The deleting contact's id.
 * @param {Boolean} isContact - True or false.
 */
function renderDeleteContactButtonBar(j, isContact) {
    let onclick = (isContact) ? `deleteUserContact(${j})` : `renderDeleteAccountConfirmation(${j})`;
    let name = (isContact) ? 'Delete' : 'Confirm';
    let buttonBar = getElement('contact-form-button-bar');
    buttonBar.innerHTML = `
        ${generateContactFormCancelButton(isContact)}
        ${generateContactFormDeleteButton(onclick, name)}
    `;
}


/**
 * Generates the delete contact form's cancel button.
 * @param {Boolean} isContact - True or false.
 * @returns The inner html code for the element 'contact-form-button-bar'.
 */
function generateContactFormCancelButton(isContact) {
    let onclick = (isContact) ? `closeDialog('dialog-delete-contact')` : `closeDeleteContact()`;
    return `
        <button class="contact-form-button" onclick="${onclick}">
            <div class="contact-form-button-text">Cancel</div>
        </button>
    `;
}


/**
 * Generates the delete contact form's delete button.
 * @param {String} onclick - The onclick attribute's value.
 * @param {String} name - The button's name.
 * @returns - The inner html code for the element 'contact-form-button-bar'.
 */
function generateContactFormDeleteButton(onclick, name) {
    return `
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" onclick="${onclick}">
            <div id="delete-contact-button-name" class="contact-form-button-dark-text">${name}</div>
        </button>
    `;
}


/**
 * Renders the delete user form.
 * @param {number} j - The deleting user's id.
 */
function renderDeleteUserForm(j) {
    renderDeleteContactMessage(j, false);
    renderDeleteContactButtonBar(j, false);
}


/**
 * Generates the deleting confirmation's message of the user.
 * @returns - The inner html code for the element 'deleting-confirmation-message'.
 */
function generateDeleteUserMessage() {
    return `
        Are you sure to delete<br>
        <b id="deleting-contact-name" class="deleting-contact-name c-lightblue">your account</b><br>
        irreversibly?
    `;
}


/**
 * Renders the delete account confirmation.
 * @param {number} j - The deleting user's id.
 */
function renderDeleteAccountConfirmation(j) {
    renderDeleteAccountMessage();
    setDeleteAccountForm(j);
    renderDeleteAccountButtonBar(j);
}


/**
 * Renders the delete account message.
 */
function renderDeleteAccountMessage() {
    let messageBox = getElement('deleting-confirmation-message');
    messageBox.innerHTML = `
        Please enter <b class="c-lightblue">email</b> and <b class="c-lightblue">password</b> to resign your join account.
    `;
}


/**
 * Sets the delete account form.
 * @param {number} j - The deleting user's id.
 */
function setDeleteAccountForm(j) {
    setClass('delete-contact-form', removeClass, 'd-none');
    setElementAttribute('delete-contact-form', 'onsubmit', `verifyDeleteAccountForm(${j}); return false`);
}


/**
 * Renders the delete user account button bar.
 * @param {number} j - The deleting user's id.
 */
function renderDeleteAccountButtonBar(j) {
    let buttonBar = getElement('contact-form-button-bar');
    buttonBar.innerHTML = `
        ${generateContactFormCancelButton(false)}
        ${generateContactFormSubmitButton()}
    `;
}


/**
 * Generates the delete contact form's submit button.
 * @returns - The inner html code for the element 'contact-form-button-bar'.
 */
function generateContactFormSubmitButton() {
    return `
        <button id="dialog-delete-contact-button" class="contact-form-button-dark" type="submit" form="delete-contact-form">
            <div id="delete-contact-button-name" class="contact-form-button-dark-text">Delete</div>
        </button>
    `;
}


/**
 * Verifies the delete contact form's input values.
 * @param {number} j The deleting user's id.
 */
async function verifyDeleteAccountForm(j) {
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


/**
 * Shows the delete account confirmation.
 */
function showDeleteAccountConfirmation() {
    let dialog = getElement('deleting-confirmation');
    dialog.innerHTML = `
        <p class="deleting-confirmation-message">
            Your user account<br>
            <b class="c-lightblue">${currentUserData.name}</b><br>
            was successfully deleted.<br>
            <br>
            Please await logout.
        </p>
    `;
}


/**
 * Redirects to the login page.
 */
function redirectToLoginPage() {
    setTimeout(() => {
        window.location.href = `./login.html`;
    }, 800);
}


/**
 * Deletes the user's account.
 */
async function deleteUserAccount() {
    let user = users.find(u => u.userId == userId);
    let userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
    await setItem('users', users);
}


/**
 * Shows up a wrong input value.
 * @param {String} email - The entered email address.
 * @param {String} password - The entered password.
 */
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


/**
 * Highlights a wrong input.
 * @param {String} info - The input element's id.
 * @param {String} logical - True or false.
 */
function highlightWrongUserInput(info, logical) {
    if (logical) {
        setClass(`delete-user-${info}`, addClass, 'delete-contact-input-wrong');
        setClass(`deleting-hint-${info}`, removeClass, 'd-none');
    } else {
        setClass(`delete-user-${info}`, removeClass, 'delete-contact-input-wrong');
        setClass(`deleting-hint-${info}`, addClass, 'd-none');
    }
}


/**
 * Closes the delete contact form.
 */
function closeDeleteContact() {
    closeDialog('dialog-delete-contact');
    resetDeleteContactForm();
}


/**
 * Resets the delete contact form.
 */
function resetDeleteContactForm() {
    resetDeleteContactInputClasses();
    resetDeleteContactInputValues();
    removeElementAttribute('delete-contact-form', 'onsubmit');
    setClass('delete-contact-form', addClass, 'd-none');
}


/**
 * Resets the delete contact form's input classes.
 */
function resetDeleteContactInputClasses() {
    setClass('delete-user-mail', removeClass, 'delete-contact-input-wrong');
    setClass('deleting-hint-mail', addClass, 'd-none');
    setClass('delete-user-password', removeClass, 'delete-contact-input-wrong');
    setClass('deleting-hint-password', addClass, 'd-none');
}


/**
 * Resets the delete contact form's input values.
 */
function resetDeleteContactInputValues() {
    document.getElementById('deleting-account-mail').value = '';
    document.getElementById('deleting-account-password').value = '';
}