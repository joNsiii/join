/**
 * Shows a contact.
 * @param {number} j - The showing contact's id.
 */
function showContact(j) {
    let classes = getElementAttribute(`contacts-contact-${j}`, 'class');
    let match = getIncludingMatch(classes, 'contacts-contact-active');
    if (!match) {
        highlightCurrentContact(j);
        updateContactViewer(j);
    } else {
        closeContactViewerMobile();
    }
}


/**
 * Highlights the current contact.
 * @param {number} j - The highlighting contact's id.
 */
function highlightCurrentContact(j) {
    if (currentContact !== undefined) {
        setClass(currentContact, removeClass, 'contacts-contact-active');
    }
    currentContact = `contacts-contact-${j}`;
    setClass(currentContact, addClass, 'contacts-contact-active');
}


/**
 * Updates the contact viewer.
 * @param {number} j - The showing contact's id.
 */
function updateContactViewer(j) {
    openDialog('dialog-contact-viewer');
    renderContactViewer(j);
    linkUserInfo(j);
    setContactButtonOnclick(j);
    showUserInfo(true);
}


/**
 * Renders the contact viewer's values.
 * @param {number} j - The showing contact's id.
 */
function renderContactViewer(j) {
    renderUserBgc(j);
    renderContactViewerVersion(j);
    renderContactViewerVersion(j, 'mobile');
}


/**
 * Renders the contact's background color.
 * @param {number} j - The showing contact's id.
 */
function renderUserBgc(j) {
    let bgc = getJsonObjectDeepValue(userContacts, j, 'bgc-code');
    let bgcCss = getElement('user-bgc-flexible');
    bgcCss.innerHTML = `
        .bgc-flexible {
            background-color: ${bgc};
        }
    `;
}


/**
 * Renders the contact viewer's version.
 * @param {number} j - The showing contact's id.
 * @param {String} extension - The optional id extension 'mobile'.
 */
function renderContactViewerVersion(j, extension) {
    (!extension) ? renderUserProfile(j) : renderUserProfile(j, extension);
    (!extension) ? renderUserInfo(j, 'name') : renderUserInfo(j, 'name', extension);
    (!extension) ? renderUserInfo(j, 'mail') : renderUserInfo(j, 'mail', extension);
    (!extension) ? renderUserInfo(j, 'phone') : renderUserInfo(j, 'phone', extension);
}


/**
 * Renders the contact's initials.
 * @param {number} j - The showing contact's id.
 * @param {String} extension - The optional id extension 'mobile'.
 */
function renderUserProfile(j, extension) {
    let id = 'contact-user-profile';
    id = (!extension) ? id : id + `-${extension}`;
    let userProfile = getElement(id);
    let profile = getInitialLetterGroup(userContacts, j);
    userProfile.innerHTML = profile;
}


/**
 * Renders the contact's information.
 * @param {number} j - The showing contact's id.
 * @param {String} info - The showing contact's information.
 * @param {String} extension - The optional id extension 'mobile'.
 */
function renderUserInfo(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getElement(id);
    let value = getJsonObjectDeepValue(userContacts, j, info);
    userInfo.innerHTML = value;
}


/**
 * Links the contact's information.
 * @param {number} j - The showing contact's id.
 */
function linkUserInfo(j) {
    setUserInfoLinkVersion(j);
    setUserInfoLinkVersion(j, 'mobile');
}


/**
 * Sets the contact info link's version.
 * @param {number} j - The showing contact's id.
 * @param {String} extension - The optional id extension 'mobile'.
 */
function setUserInfoLinkVersion(j, extension) {
    (!extension) ? setUserInfoLink(j, 'mail') : setUserInfoLink(j, 'mail', 'mobile');
    (!extension) ? setUserInfoLink(j, 'phone') : setUserInfoLink(j, 'phone', 'mobile');
}


/**
 * Sets the contact info link.
 * @param {number} j - The showing contact's id.
 * @param {String} info - The showing contact's information.
 * @param {String} extension - The optional id extension 'mobile'.
 */
function setUserInfoLink(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getJsonObjectDeepValue(userContacts, j, info);
    (info == 'mail') ? setElementAttribute(id, 'href', `mailto: ${userInfo}`) : setElementAttribute(id, 'href', `tel: ${userInfo}`);
}


/**
 * Sets the contact buttons' onclick functions.
 * @param {number} j - The showing contact's id. 
 */
function setContactButtonOnclick(j) {
    setElementAttribute('edit-contact-button', 'onclick', `showEditContactForm(${j})`);
    setElementAttribute('edit-contact-button-mobile', 'onclick', `showEditContactForm(${j})`);
    setElementAttribute('delete-contact-button', 'onclick', `openDialogDeleteContact(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `openDialogDeleteContact(${j})`);
}


/**
 * Shows the contact's information.
 * @param {Boolean} logical - True or false.
 */
function showUserInfo(logical) {
    let value = (logical) ? '55px' : '100%';
    let style = getElement('contact-user-animation');
    style.innerHTML = (logical) ? animateContactUserIn(value) : animateContactUserOut(value);
}


/**
 * Animates the contact information's come in.
 * @param {value} value - The css property's value.
 * @returns - The css code for the element 'contact-user-animation'.
 */
function animateContactUserIn(value) {
    return `
        .contact-user-animation {
            left: ${value};
            transition: 100ms left ease-in-out;
        }
    `;
}


/**
 * Animates the contact information's come out.
 * @param {value} value - The css property's value.
 * @returns - The css code for the element 'contact-user-animation'.
 */
function animateContactUserOut(value) {
    return `
        .contact-user-animation {
            left: ${value};
        }
    `;
}


/**
 * Closes the contact viewer mobile.
 */
function closeContactViewerMobile() {
    setClass(currentContact, removeClass, 'contacts-contact-active');
    showUserInfo(false);
    closeDialog('dialog-contact-viewer');
}