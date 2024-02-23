// jsdoc
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


// jsdoc
function highlightCurrentContact(j) {
    if (currentContact !== undefined) {
        setClassOnCommand(currentContact, 'remove', 'contacts-contact-active');
    }
    currentContact = `contacts-contact-${j}`;
    setClassOnCommand(currentContact, 'add', 'contacts-contact-active');
}


// jsdoc
function updateContactViewer(j) {
    openDialog('dialog-contact-viewer');
    renderContactViewer(j);
    linkUserInfo(j);
    setContactButtonOnclick(j);
    showUserInfo(true);
}


// jsdoc
function renderContactViewer(j) {
    renderUserBgc(j);
    renderContactViewerVersion(j);
    renderContactViewerVersion(j, 'mobile');
}


// jsdoc
function renderUserBgc(j) {
    let bgc = getJsonObjectDeepValue(userContacts, j, 'bgc-code');
    let bgcCss = getElement('user-bgc-flexible');
    bgcCss.innerHTML = `
        .bgc-flexible {
            background-color: ${bgc};
        }
    `;
}


// jsdoc
function renderContactViewerVersion(j, extension) {
    (!extension) ? renderUserProfile(j) : renderUserProfile(j, extension);
    (!extension) ? renderUserInfo(j, 'name') : renderUserInfo(j, 'name', extension);
    (!extension) ? renderUserInfo(j, 'mail') : renderUserInfo(j, 'mail', extension);
    (!extension) ? renderUserInfo(j, 'phone') : renderUserInfo(j, 'phone', extension);
}


// jsdoc
function renderUserProfile(j, extension) {
    let id = 'contact-user-profile';
    id = (!extension) ? id : id + `-${extension}`;
    let userProfile = getElement(id);
    let profile = getInitialLetterGroup(userContacts, j);
    userProfile.innerHTML = profile;
}


// jsdoc
function renderUserInfo(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getElement(id);
    let value = getJsonObjectDeepValue(userContacts, j, info);
    userInfo.innerHTML = value;
}


// jsdoc
function linkUserInfo(j) {
    setUserInfoLinkVersion(j);
    setUserInfoLinkVersion(j, 'mobile');
}


// jsdoc
function setUserInfoLinkVersion(j, extension) {
    (!extension) ? setUserInfoLink(j, 'mail') : setUserInfoLink(j, 'mail', 'mobile');
    (!extension) ? setUserInfoLink(j, 'phone') : setUserInfoLink(j, 'phone', 'mobile');
}


// jsdoc
function setUserInfoLink(j, info, extension) {
    let id = `contact-user-${info}`;
    id = (!extension) ? id : id + `-${extension}`;
    let userInfo = getJsonObjectDeepValue(userContacts, j, info);
    (info == 'mail') ? setElementAttribute(id, 'href', `mailto: ${userInfo}`) : setElementAttribute(id, 'href', `tel: ${userInfo}`);
}


// jsdoc
function setContactButtonOnclick(j) {
    setElementAttribute('edit-contact-button', 'onclick', `showEditContactForm(${j})`);
    setElementAttribute('edit-contact-button-mobile', 'onclick', `showEditContactForm(${j})`);
    setElementAttribute('delete-contact-button', 'onclick', `openDialogDeleteContact(${j})`);
    setElementAttribute('delete-contact-button-mobile', 'onclick', `openDialogDeleteContact(${j})`);
}


// jsdoc
function showUserInfo(logical) {
    let value = (logical) ? '55px' : '100%';
    let style = getElement('contact-user-animation');
    style.innerHTML = (logical) ? animateContactUserIn(value) : animateContactUserOut(value);
}


// jsdoc
function animateContactUserIn(value) {
    return `
        .contact-user-animation {
            left: ${value};
            transition: 125ms left ease-in-out;
        }
    `;
}


// jsdoc
function animateContactUserOut(value) {
    return `
        .contact-user-animation {
            left: ${value};
        }
    `;
}


// jsdoc
function closeContactViewerMobile() {
    setClassOnCommand(currentContact, 'remove', 'contacts-contact-active');
    showUserInfo(false);
    closeDialog('dialog-contact-viewer');
}