function renderContactForm(j) {
    let input = getElement('edit-contact-name');
    let userName = getJsonObjectDeepValue(contactSample, j, 'name');
    input.value = userName;
} 