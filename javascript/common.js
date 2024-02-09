/**
 * Adds a class to the element 'id'.
 * @param {value} id - The element's id.
 * @param {String} className - The adding class name.
 */
function addClass(id, className) {
    document.getElementById(id).classList.add(className);
}


/**
 * Closes a dialog by id.
 * @param {String} id - The dialog's id.
 */
function closeDialog(id) {
    document.getElementById(id).close();
}


/**
 * Provides an element by id.
 * @param {String} id - The requested element's id.
 * @returns - The requested element.
 */
function getElement(id) {
    return document.getElementById(id);
}


/**
 * Provides a a json's deeper object value.
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @param {value} subkey - The requested object's subkey.
 * @returns - The requested object's deep value.
 */
function getJsonObjectDeepValue(variable, key, subkey) {
    return variable[key][subkey];
}


/**
//  * Provides a json's object value.
 * @param {json} variable - The providing json.
 * @param {value} key - The requested object's key.
 * @returns - The requested object's value.
 */
function getJsonObjectValue(variable, key) {
    return variable[key];
}


/**
 * Opens a dialog by id.
 * @param {String} id - The dialog's id.
 */
function openDialog(id) {
    document.getElementById(id).show();
}


/**
 * Sets an element's attribute.
 * @param {value} id - The element's id.
 * @param {String} attribute - The setting attribute.
 * @param {value} value - The setting value.
 */
function setElementAttribute(id, attribute, value) {
    document.getElementById(id).setAttribute(attribute, value);
}


/**
 * Prevents closing of the dialog by clicking on the dialog window.
 * @param {event} event
 */
function stop(event) {
    event.stopPropagation();
}